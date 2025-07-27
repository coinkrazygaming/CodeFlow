import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { supabaseAdmin } from './database';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        try {
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            await supabaseAdmin.from('users').insert({
              id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              github_username: profile?.login,
              subscription_tier: 'free',
              ai_edits_used: 0
            });
          }
          return true;
        } catch (error) {
          console.error('Error saving user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (user) {
          session.user.id = user.id;
          session.user.subscription_tier = user.subscription_tier;
          session.user.ai_edits_used = user.ai_edits_used;
          session.user.github_username = user.github_username;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
};
