import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

/** Cached Payload local-API client for use in server components and routes. */
export const getPayloadClient = async () => getPayloadInstance({ config })
