/**
 * @packageDocumentation
 * @module @hatsy/http-header-value/node
 */
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { Socket } from 'net';
import { TLSSocket } from 'tls';
import { HthvForwarded } from '../headers';

/**
 * HTTP request information.
 *
 * Collected accordingly to proxy forwarding information.
 */
export interface HthvRequestInfo {

  /**
   * Trusted proxy forwarding information.
   */
  readonly forwarded: HthvForwarded;

  /**
   * Request URL constructed with respect proxy forwarding information.
   */
  readonly requestURL: URL;

}

export const HthvRequestInfo = {

  /**
   * Collects {@link HthvForwarded.Defaults proxy forwarding defaults} from HTTP request.
   *
   * This information does not rely on proxy forwarding information.
   *
   * @param request  HTTP request to collect information from.
   *
   * @returns Collected proxy forwarding defaults.
   */
  defaults(request: IncomingMessage): HthvForwarded.Defaults {

    const {
      connection,
      headers,
    }: {
      connection: TLSSocket | Socket;
      headers: IncomingHttpHeaders;
    } = request;

    return {
      by: connection.localAddress,
      for: connection.remoteAddress || 'unknown',
      host: headers.host || (`${connection.localAddress}:${connection.localPort}`),
      proto: ((connection as TLSSocket).encrypted ? 'https' : 'http'),
    };
  },

  /**
   * Collects information from HTTP request.
   *
   * Uses {@link HthvForwarded.parse} to collect trusted proxy forwarding information.
   *
   * @param request  HTTP request to collect information from.
   * @param trust  A trust policy to proxy forwarding records.
   *
   * @returns  Collected HTTP request info.
   */
  collect(request: IncomingMessage, trust?: HthvForwarded.Trust): HthvRequestInfo {

    const forwarded = HthvForwarded.parse(
        request.headers as HthvForwarded.Headers,
        HthvRequestInfo.defaults(request),
        trust,
    );

    let requestURL: URL | undefined;

    return {
      forwarded,
      get requestURL(): URL {
        return requestURL || (requestURL = new URL(
            request.url || '',
            `${forwarded.proto}://${forwarded.host}`,
        ));
      },
    };
  },

};
