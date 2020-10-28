const _ = require("lodash");
const { jarFromCookies } = require('insomnia-cookies');

module.exports.templateTags = [{
    name: "x_xsrf_token",
    displayName: "X-XSRF-TOKEN",
    description: "XSRF Token from Cookie",
    args: [
        {
            type: 'string',
            displayName: 'API Url',
            description: 'fully qualified URL (e.g. https://domain.tld/path)',
          }
    ],
    async run (context, url) {
        const key = 'XSRF-TOKEN';
        const { meta } = context;
        const workspace = await context.util.models.workspace.getById(meta.workspaceId);

        if (! workspace) {
          throw new Error(`Workspace not found for ${meta.workspaceId}`);
        }

        const cookieJar = await context.util.models.cookieJar.getOrCreateForWorkspace(workspace);
        const jar = jarFromCookies(cookieJar.cookies);
        const cookies = jar.getCookiesSync(url);

        const index = _.findIndex(cookies, function(o) { return key === o.key });
        let value = cookies[index].value;
        value = value.replace('%3D', '=');

        return value;
    }
}];
