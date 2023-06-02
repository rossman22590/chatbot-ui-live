import { NextApiRequest, NextApiResponse } from 'next';

import querystring from 'querystring';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  var scope = (req.query.scope as string) || null;

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.PLUGIN_SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: 'http://localhost:3000/api/plugins/spotify/callback',
        show_dialog: true,
      }),
  );
};

export default handler;
