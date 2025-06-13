import { SessionStrategy, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';

// Initialize Prisma
const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrUsername: {
          label: 'Email or Username',
          type: 'text',
          placeholder: 'Enter email or username',
        },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password)
          return null;

        // Function to determine if input is email or username
        const isEmail = (input: string) => input.includes('@');

        // Try to find user by email or name (using name as username for now)
        const user = await prisma.user.findFirst({
          where: isEmail(credentials.emailOrUsername)
            ? { email: credentials.emailOrUsername }
            : { name: credentials.emailOrUsername },
        });

        if (!user) {
          return null;
        }
        if (!user.verified) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          rememberMe: credentials.rememberMe === 'true',
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // Maximum possible age (30 days)
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.user = user;
        token.role = user.role;
        token.verified = true;
        token.rememberMe = user.rememberMe;

        // Set token expiration based on remember me preference
        const now = Math.floor(Date.now() / 1000);
        if (user.rememberMe) {
          // 30 days for remember me
          token.exp = now + 30 * 24 * 60 * 60;
        } else {
          // 8 hours when remember me is not checked
          token.exp = now + 8 * 60 * 60;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.user) {
        session.user = token.user as User;
        session.user.role = token.role;
        session.user.verified = token.verified;
      }

      // Set session expiry based on token
      if (token.exp && typeof token.exp === 'number') {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = token.exp - now;

        // If token is expired or about to expire, invalidate session
        if (timeLeft <= 0) {
          return null;
        }

        // Set the session expiry to match the token expiry
        session.expires = new Date(token.exp * 1000).toISOString();
      }

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
