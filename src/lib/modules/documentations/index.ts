import { setTimeout as delay } from 'node:timers/promises'
import fs from 'fs';
import swaggerUi from 'swagger-ui-express'
import YAMLJS from 'yamljs'
import YAML from 'yaml';
import RouterInterface from '../../../types/interfaces/router';
import RequestHandler from '../server/router';

const YAML_SOURCE_URL = `${__dirname}/yaml_doc/openapi.yml`;

type DocumentationProps = {
    app : RouterInterface,
    router: RequestHandler,
    documentationRoute: string
}

class DocumentationRepository {

    private static writeDocumentation = async (router: RequestHandler) => {
        await delay(1000);
        const yamlToJson = YAMLJS.load(YAML_SOURCE_URL);

        router.listEndPoint.forEach((data) => {
            if (!yamlToJson.paths[data.endpoint]) {
                let title = data.method.toLowerCase().split('/')[1]

                yamlToJson.paths[data.endpoint] = {};
                yamlToJson.paths[data.endpoint][data.method.toLowerCase()] = {
                    responses: {
                        '200': { description: 'OK' }
                    }
                };
                yamlToJson.tags.push({
                    name: title,
                    description: `Secured ${title}-only calls`
                });
            }
        })

        const jsonToYaml = new YAML.Document();

        jsonToYaml.contents = yamlToJson;

        fs.writeFileSync(YAML_SOURCE_URL, jsonToYaml.toString());

        return yamlToJson
    }

    static useSwaggerDocument = async ({app, router, documentationRoute, }: DocumentationProps) => {
        const swaggerDocument = await this.writeDocumentation(router);
        app.use( documentationRoute, swaggerUi.serve, swaggerUi.setup(swaggerDocument) );
    }

}

export default DocumentationRepository;