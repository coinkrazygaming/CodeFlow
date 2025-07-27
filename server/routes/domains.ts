import { RequestHandler } from 'express';
import { supabaseAdmin } from '../../lib/database';

export const getDomains: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: domains, error } = await supabaseAdmin
      .from('domains')
      .select(`
        id,
        domain,
        verified,
        dns_records,
        created_at,
        projects!inner(id, name)
      `)
      .eq('projects.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to include project info
    const transformedDomains = domains?.map(domain => ({
      ...domain,
      project_id: domain.projects.id,
      project_name: domain.projects.name,
      ssl_status: domain.verified ? 'active' : 'pending'
    })) || [];

    res.json(transformedDomains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
};

export const addDomain: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { domain, project_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!domain || !project_id) {
      return res.status(400).json({ error: 'Domain and project ID are required' });
    }

    // Verify the project belongs to the user
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', userId)
      .single();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate DNS records
    const isClean8Subdomain = domain.endsWith('.clean8.online');
    const dnsRecords = isClean8Subdomain ? [] : [
      {
        type: 'CNAME',
        name: domain.includes('.') ? domain.split('.')[0] : '@',
        value: 'codeflow-ai.vercel.app',
        required: true
      },
      {
        type: 'TXT',
        name: domain,
        value: `codeflow-verification=${project_id}`,
        required: true
      }
    ];

    const { data: newDomain, error } = await supabaseAdmin
      .from('domains')
      .insert({
        domain,
        project_id,
        verified: isClean8Subdomain, // Auto-verify clean8.online subdomains
        dns_records: dnsRecords
      })
      .select()
      .single();

    if (error) throw error;

    res.json(newDomain);
  } catch (error) {
    console.error('Error adding domain:', error);
    res.status(500).json({ error: 'Failed to add domain' });
  }
};

export const deleteDomain: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { domainId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify domain belongs to user's project
    const { data: domain } = await supabaseAdmin
      .from('domains')
      .select(`
        id,
        projects!inner(user_id)
      `)
      .eq('id', domainId)
      .eq('projects.user_id', userId)
      .single();

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const { error } = await supabaseAdmin
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting domain:', error);
    res.status(500).json({ error: 'Failed to delete domain' });
  }
};

export const verifyDomain: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { domainId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get domain info
    const { data: domain } = await supabaseAdmin
      .from('domains')
      .select(`
        id,
        domain,
        dns_records,
        projects!inner(user_id)
      `)
      .eq('id', domainId)
      .eq('projects.user_id', userId)
      .single();

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    // Simple verification simulation (in real implementation, check DNS records)
    const isVerified = domain.domain.endsWith('.clean8.online') || Math.random() > 0.3;

    if (isVerified) {
      await supabaseAdmin
        .from('domains')
        .update({ verified: true })
        .eq('id', domainId);
    }

    res.json({ verified: isVerified });
  } catch (error) {
    console.error('Error verifying domain:', error);
    res.status(500).json({ error: 'Failed to verify domain' });
  }
};
