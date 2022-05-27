import { struct } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { ExtensionType, getExtensionData } from './extensionType';
/** Buffer layout for de/serializing a mint */
export var MintCloseAuthorityLayout = struct([publicKey('closeAuthority')]);
export var MINT_CLOSE_AUTHORITY_SIZE = MintCloseAuthorityLayout.span;
export function getMintCloseAuthority(mint) {
    var extensionData = getExtensionData(ExtensionType.MintCloseAuthority, mint.tlvData);
    if (extensionData !== null) {
        return MintCloseAuthorityLayout.decode(extensionData);
    }
    else {
        return null;
    }
}
