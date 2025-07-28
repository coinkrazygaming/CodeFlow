import { RequestHandler } from 'express';
import { supabaseAdmin } from '../../lib/database';
import { GitHubService } from '../../lib/github';

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', ''); // Simplified auth
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json(projects || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { name, description, github_repo } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        description,
        github_repo,
        user_id: userId,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;

    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const deployProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '');
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update project status to building
    await supabaseAdmin
      .from('projects')
      .update({ status: 'building' })
      .eq('id', projectId)
      .eq('user_id', userId);

    // Create deployment record
    const { data: deployment } = await supabaseAdmin
      .from('deployments')
      .insert({
        project_id: projectId,
        status: 'pending',
        logs: 'Starting deployment...'
      })
      .select()
      .single();

    // Simulate deployment process
    setTimeout(async () => {
      try {
        // Update deployment status
        await supabaseAdmin
          .from('deployments')
          .update({
            status: 'success',
            logs: 'Deployment completed successfully',
            deployment_url: `https://${projectId}.codeflow.app`
          })
          .eq('id', deployment.id);

        // Update project status
        await supabaseAdmin
          .from('projects')
          .update({
            status: 'deployed',
            deployment_url: `https://${projectId}.codeflow.app`
          })
          .eq('id', projectId);
      } catch (error) {
        console.error('Deployment error:', error);
        await supabaseAdmin
          .from('deployments')
          .update({
            status: 'failed',
            logs: 'Deployment failed: ' + error.message
          })
          .eq('id', deployment.id);

        await supabaseAdmin
          .from('projects')
          .update({ status: 'error' })
          .eq('id', projectId);
      }
    }, 5000); // 5 second simulation

    res.json({ message: 'Deployment started', deploymentId: deployment.id });
  } catch (error) {
    console.error('Error deploying project:', error);
    res.status(500).json({ error: 'Failed to deploy project' });
  }
};
