import { NextApiRequest, NextApiResponse } from 'next';

import querystring from 'querystring';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  let code = (req.query.code as string) || null;

  const form = {
    grant_type: 'authorization_code',
    code: code!,
    redirect_uri: 'http://localhost:3000/api/plugins/spotify/callback',
  };

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Content_Type: 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.PLUGIN_SPOTIFY_CLIENT_ID +
            ':' +
            process.env.PLUGIN_SPOTIFY_CLIENT_SECRET,
        ).toString('base64'),
    },
    body: new URLSearchParams(form),
  });

  const resBody = await response.json();

  res.redirect(
    'http://localhost:3000/plugin-auth/callback?' +
      querystring.stringify({
        plugin_id: 'com.jmenjivar.spotify',
        access_token: resBody.access_token,
        refresh_token: resBody.refresh_token,
        expires_in: resBody.expires_in,
      }),
  );
};

export default handler;
