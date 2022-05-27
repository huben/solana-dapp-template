var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { sendAndConfirmTransaction, SystemProgram, Transaction, } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { createInitializeAccountInstruction } from '../instructions/index';
import { getMint } from '../state/index';
import { createAssociatedTokenAccount } from './createAssociatedTokenAccount';
import { getAccountLenForMint } from '../extensions/extensionType';
/**
 * Create and initialize a new token account
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction and initialization fees
 * @param mint           Mint for the account
 * @param owner          Owner of the new account
 * @param keypair        Optional keypair, defaulting to the associated token account for the `mint` and `owner`
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Address of the new token account
 */
export function createAccount(connection, payer, mint, owner, keypair, confirmOptions, programId) {
    if (programId === void 0) { programId = TOKEN_PROGRAM_ID; }
    return __awaiter(this, void 0, void 0, function () {
        var mintState, space, lamports, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!keypair) return [3 /*break*/, 2];
                    return [4 /*yield*/, createAssociatedTokenAccount(connection, payer, mint, owner, confirmOptions, programId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, getMint(connection, mint, confirmOptions === null || confirmOptions === void 0 ? void 0 : confirmOptions.commitment, programId)];
                case 3:
                    mintState = _a.sent();
                    space = getAccountLenForMint(mintState);
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(space)];
                case 4:
                    lamports = _a.sent();
                    transaction = new Transaction().add(SystemProgram.createAccount({
                        fromPubkey: payer.publicKey,
                        newAccountPubkey: keypair.publicKey,
                        space: space,
                        lamports: lamports,
                        programId: programId,
                    }), createInitializeAccountInstruction(keypair.publicKey, mint, owner, programId));
                    return [4 /*yield*/, sendAndConfirmTransaction(connection, transaction, [payer, keypair], confirmOptions)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, keypair.publicKey];
            }
        });
    });
}
