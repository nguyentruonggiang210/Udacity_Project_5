import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';
import { deleteEmployeeGroupById } from '../../businessLogic/employeeGroup'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const employeeGroupId = event.pathParameters.employeeGroupId
        await deleteEmployeeGroupById(employeeGroupId, getUserId(event));
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify("Deleted successfully!")
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
