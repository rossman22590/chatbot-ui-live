import { withAuth } from 'next-auth/middleware';

import { AUTH_ENABLED } from '@chatbot-ui/core/utils/const';
import { dockerEnvVarFix } from '@chatbot-ui/core/utils/docker';

const getSecret = () => {
  if (!AUTH_ENABLED) {
    return 'auth_not_enabled';
  } else {
    return dockerEnvVarFix(process.env.NEXTAUTH_SECRET);
  }
};

// export default withAuth({
//   callbacks: {
//     async authorized({ token }) {
//       console.log('authorized', token);
//       if (AUTH_ENABLED === false) {
//         return true;
//       }
//       if (!token?.email) {
//         return false;
//       } else {
//         const pattern =
//           dockerEnvVarFix(process.env.NEXTAUTH_EMAIL_PATTERN) || '';
//         if (!pattern || token?.email?.match('^' + pattern + '$')) {
//           return true;
//         }

//         return false;
//       }
//     },
//   },
//   secret: getSecret(),
// });

const getEmailPatterns = () => {
  if (!AUTH_ENABLED) {
    return [];
  } else {
    const patternsString = dockerEnvVarFix(process.env.NEXTAUTH_EMAIL_PATTERNS);
    return patternsString ? patternsString.split(',') : [];
  }
};

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      if (AUTH_ENABLED === false) {
        return true;
      }
      if (!token?.email) {
        return false;
      } else {
        const patterns = getEmailPatterns();
        if (patterns.length === 0) {
          return true; // No patterns specified, allow access
        }

        const email = token.email.toLowerCase();
        for (const pattern of patterns) {
          const regex = new RegExp(pattern.trim());
          if (email.match(regex)) {
            return true; // Email matches one of the patterns, allow access
          }
        }

        return false; // Email does not match any of the patterns, deny access
      }
    },
  },
  secret: getSecret(),
});
