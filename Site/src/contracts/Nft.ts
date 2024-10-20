// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { 
	Cell,
	Slice, 
	Address, 
	Builder, 
	beginCell, 
	ComputeError, 
	TupleItem, 
	TupleReader, 
	Dictionary, 
	contractAddress, 
	ContractProvider, 
	Sender, 
	Contract, 
	ContractABI, 
	ABIType,
	ABIGetter,
	ABIReceiver,
	TupleBuilder,
	DictionaryValue
} from '@ton/core';

export type StateInit = {
	$$type: 'StateInit';
	code: Cell;
	data: Cell;
}

export function storeStateInit(src: StateInit) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeRef(src.code);
			b_0.storeRef(src.data);
	};
}

export function loadStateInit(slice: Slice) {
	let sc_0 = slice;
	let _code = sc_0.loadRef();
	let _data = sc_0.loadRef();
	return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
	let _code = source.readCell();
	let _data = source.readCell();
	return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
	let _code = source.readCell();
	let _data = source.readCell();
	return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
	let builder = new TupleBuilder();
	builder.writeCell(source.code);
	builder.writeCell(source.data);
	return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
			},
			parse: (src) => {
					return loadStateInit(src.loadRef().beginParse());
			}
	}
}

export type StdAddress = {
	$$type: 'StdAddress';
	workchain: bigint;
	address: bigint;
}

export function storeStdAddress(src: StdAddress) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeInt(src.workchain, 8);
			b_0.storeUint(src.address, 256);
	};
}

export function loadStdAddress(slice: Slice) {
	let sc_0 = slice;
	let _workchain = sc_0.loadIntBig(8);
	let _address = sc_0.loadUintBig(256);
	return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
	let _workchain = source.readBigNumber();
	let _address = source.readBigNumber();
	return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
	let _workchain = source.readBigNumber();
	let _address = source.readBigNumber();
	return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.workchain);
	builder.writeNumber(source.address);
	return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
			},
			parse: (src) => {
					return loadStdAddress(src.loadRef().beginParse());
			}
	}
}

export type VarAddress = {
	$$type: 'VarAddress';
	workchain: bigint;
	address: Slice;
}

export function storeVarAddress(src: VarAddress) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeInt(src.workchain, 32);
			b_0.storeRef(src.address.asCell());
	};
}

export function loadVarAddress(slice: Slice) {
	let sc_0 = slice;
	let _workchain = sc_0.loadIntBig(32);
	let _address = sc_0.loadRef().asSlice();
	return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
	let _workchain = source.readBigNumber();
	let _address = source.readCell().asSlice();
	return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
	let _workchain = source.readBigNumber();
	let _address = source.readCell().asSlice();
	return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.workchain);
	builder.writeSlice(source.address.asCell());
	return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
			},
			parse: (src) => {
					return loadVarAddress(src.loadRef().beginParse());
			}
	}
}

export type Context = {
	$$type: 'Context';
	bounced: boolean;
	sender: Address;
	value: bigint;
	raw: Slice;
}

export function storeContext(src: Context) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeBit(src.bounced);
			b_0.storeAddress(src.sender);
			b_0.storeInt(src.value, 257);
			b_0.storeRef(src.raw.asCell());
	};
}

export function loadContext(slice: Slice) {
	let sc_0 = slice;
	let _bounced = sc_0.loadBit();
	let _sender = sc_0.loadAddress();
	let _value = sc_0.loadIntBig(257);
	let _raw = sc_0.loadRef().asSlice();
	return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
	let _bounced = source.readBoolean();
	let _sender = source.readAddress();
	let _value = source.readBigNumber();
	let _raw = source.readCell().asSlice();
	return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
	let _bounced = source.readBoolean();
	let _sender = source.readAddress();
	let _value = source.readBigNumber();
	let _raw = source.readCell().asSlice();
	return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
	let builder = new TupleBuilder();
	builder.writeBoolean(source.bounced);
	builder.writeAddress(source.sender);
	builder.writeNumber(source.value);
	builder.writeSlice(source.raw.asCell());
	return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeContext(src)).endCell());
			},
			parse: (src) => {
					return loadContext(src.loadRef().beginParse());
			}
	}
}

export type SendParameters = {
	$$type: 'SendParameters';
	bounce: boolean;
	to: Address;
	value: bigint;
	mode: bigint;
	body: Cell | null;
	code: Cell | null;
	data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeBit(src.bounce);
			b_0.storeAddress(src.to);
			b_0.storeInt(src.value, 257);
			b_0.storeInt(src.mode, 257);
			if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
			if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
			if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
	};
}

export function loadSendParameters(slice: Slice) {
	let sc_0 = slice;
	let _bounce = sc_0.loadBit();
	let _to = sc_0.loadAddress();
	let _value = sc_0.loadIntBig(257);
	let _mode = sc_0.loadIntBig(257);
	let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
	let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
	let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
	return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
	let _bounce = source.readBoolean();
	let _to = source.readAddress();
	let _value = source.readBigNumber();
	let _mode = source.readBigNumber();
	let _body = source.readCellOpt();
	let _code = source.readCellOpt();
	let _data = source.readCellOpt();
	return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
	let _bounce = source.readBoolean();
	let _to = source.readAddress();
	let _value = source.readBigNumber();
	let _mode = source.readBigNumber();
	let _body = source.readCellOpt();
	let _code = source.readCellOpt();
	let _data = source.readCellOpt();
	return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
	let builder = new TupleBuilder();
	builder.writeBoolean(source.bounce);
	builder.writeAddress(source.to);
	builder.writeNumber(source.value);
	builder.writeNumber(source.mode);
	builder.writeCell(source.body);
	builder.writeCell(source.code);
	builder.writeCell(source.data);
	return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
			},
			parse: (src) => {
					return loadSendParameters(src.loadRef().beginParse());
			}
	}
}

export type Deploy = {
	$$type: 'Deploy';
	queryId: bigint;
}

export function storeDeploy(src: Deploy) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(2490013878, 32);
			b_0.storeUint(src.queryId, 64);
	};
}

export function loadDeploy(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
	let _queryId = sc_0.loadUintBig(64);
	return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
	let _queryId = source.readBigNumber();
	return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
	let _queryId = source.readBigNumber();
	return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.queryId);
	return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
			},
			parse: (src) => {
					return loadDeploy(src.loadRef().beginParse());
			}
	}
}

export type DeployOk = {
	$$type: 'DeployOk';
	queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(2952335191, 32);
			b_0.storeUint(src.queryId, 64);
	};
}

export function loadDeployOk(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
	let _queryId = sc_0.loadUintBig(64);
	return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
	let _queryId = source.readBigNumber();
	return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
	let _queryId = source.readBigNumber();
	return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.queryId);
	return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
			},
			parse: (src) => {
					return loadDeployOk(src.loadRef().beginParse());
			}
	}
}

export type FactoryDeploy = {
	$$type: 'FactoryDeploy';
	queryId: bigint;
	cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(1829761339, 32);
			b_0.storeUint(src.queryId, 64);
			b_0.storeAddress(src.cashback);
	};
}

export function loadFactoryDeploy(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
	let _queryId = sc_0.loadUintBig(64);
	let _cashback = sc_0.loadAddress();
	return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
	let _queryId = source.readBigNumber();
	let _cashback = source.readAddress();
	return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
	let _queryId = source.readBigNumber();
	let _cashback = source.readAddress();
	return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.queryId);
	builder.writeAddress(source.cashback);
	return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
			},
			parse: (src) => {
					return loadFactoryDeploy(src.loadRef().beginParse());
			}
	}
}

export type AgreementInfos = {
	$$type: 'AgreementInfos';
	owner: Address;
	customer: Address;
	token: bigint;
	timestart: bigint;
	timeend: bigint;
	agreement_duration: bigint;
	price_per_hour: bigint;
	stake: bigint;
	has_staked: boolean;
	owner_claimed: boolean;
}

export function storeAgreementInfos(src: AgreementInfos) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeAddress(src.owner);
			b_0.storeAddress(src.customer);
			b_0.storeInt(src.token, 257);
			b_0.storeUint(src.timestart, 128);
			let b_1 = new Builder();
			b_1.storeUint(src.timeend, 128);
			b_1.storeUint(src.agreement_duration, 128);
			b_1.storeUint(src.price_per_hour, 128);
			b_1.storeUint(src.stake, 128);
			b_1.storeBit(src.has_staked);
			b_1.storeBit(src.owner_claimed);
			b_0.storeRef(b_1.endCell());
	};
}

export function loadAgreementInfos(slice: Slice) {
	let sc_0 = slice;
	let _owner = sc_0.loadAddress();
	let _customer = sc_0.loadAddress();
	let _token = sc_0.loadIntBig(257);
	let _timestart = sc_0.loadUintBig(128);
	let sc_1 = sc_0.loadRef().beginParse();
	let _timeend = sc_1.loadUintBig(128);
	let _agreement_duration = sc_1.loadUintBig(128);
	let _price_per_hour = sc_1.loadUintBig(128);
	let _stake = sc_1.loadUintBig(128);
	let _has_staked = sc_1.loadBit();
	let _owner_claimed = sc_1.loadBit();
	return { $$type: 'AgreementInfos' as const, owner: _owner, customer: _customer, token: _token, timestart: _timestart, timeend: _timeend, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake, has_staked: _has_staked, owner_claimed: _owner_claimed };
}

function loadTupleAgreementInfos(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _token = source.readBigNumber();
	let _timestart = source.readBigNumber();
	let _timeend = source.readBigNumber();
	let _agreement_duration = source.readBigNumber();
	let _price_per_hour = source.readBigNumber();
	let _stake = source.readBigNumber();
	let _has_staked = source.readBoolean();
	let _owner_claimed = source.readBoolean();
	return { $$type: 'AgreementInfos' as const, owner: _owner, customer: _customer, token: _token, timestart: _timestart, timeend: _timeend, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake, has_staked: _has_staked, owner_claimed: _owner_claimed };
}

function loadGetterTupleAgreementInfos(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _token = source.readBigNumber();
	let _timestart = source.readBigNumber();
	let _timeend = source.readBigNumber();
	let _agreement_duration = source.readBigNumber();
	let _price_per_hour = source.readBigNumber();
	let _stake = source.readBigNumber();
	let _has_staked = source.readBoolean();
	let _owner_claimed = source.readBoolean();
	return { $$type: 'AgreementInfos' as const, owner: _owner, customer: _customer, token: _token, timestart: _timestart, timeend: _timeend, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake, has_staked: _has_staked, owner_claimed: _owner_claimed };
}

function storeTupleAgreementInfos(source: AgreementInfos) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeAddress(source.customer);
	builder.writeNumber(source.token);
	builder.writeNumber(source.timestart);
	builder.writeNumber(source.timeend);
	builder.writeNumber(source.agreement_duration);
	builder.writeNumber(source.price_per_hour);
	builder.writeNumber(source.stake);
	builder.writeBoolean(source.has_staked);
	builder.writeBoolean(source.owner_claimed);
	return builder.build();
}

function dictValueParserAgreementInfos(): DictionaryValue<AgreementInfos> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeAgreementInfos(src)).endCell());
			},
			parse: (src) => {
					return loadAgreementInfos(src.loadRef().beginParse());
			}
	}
}

export type Agreement = {
	$$type: 'Agreement';
	owner: Address;
	customer: Address;
	token: bigint;
	agreement_duration: bigint;
	price_per_hour: bigint;
	stake: bigint;
}

export function storeAgreement(src: Agreement) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(2413122805, 32);
			b_0.storeAddress(src.owner);
			b_0.storeAddress(src.customer);
			b_0.storeInt(src.token, 257);
			b_0.storeUint(src.agreement_duration, 128);
			let b_1 = new Builder();
			b_1.storeUint(src.price_per_hour, 128);
			b_1.storeUint(src.stake, 128);
			b_0.storeRef(b_1.endCell());
	};
}

export function loadAgreement(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 2413122805) { throw Error('Invalid prefix'); }
	let _owner = sc_0.loadAddress();
	let _customer = sc_0.loadAddress();
	let _token = sc_0.loadIntBig(257);
	let _agreement_duration = sc_0.loadUintBig(128);
	let sc_1 = sc_0.loadRef().beginParse();
	let _price_per_hour = sc_1.loadUintBig(128);
	let _stake = sc_1.loadUintBig(128);
	return { $$type: 'Agreement' as const, owner: _owner, customer: _customer, token: _token, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake };
}

function loadTupleAgreement(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _token = source.readBigNumber();
	let _agreement_duration = source.readBigNumber();
	let _price_per_hour = source.readBigNumber();
	let _stake = source.readBigNumber();
	return { $$type: 'Agreement' as const, owner: _owner, customer: _customer, token: _token, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake };
}

function loadGetterTupleAgreement(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _token = source.readBigNumber();
	let _agreement_duration = source.readBigNumber();
	let _price_per_hour = source.readBigNumber();
	let _stake = source.readBigNumber();
	return { $$type: 'Agreement' as const, owner: _owner, customer: _customer, token: _token, agreement_duration: _agreement_duration, price_per_hour: _price_per_hour, stake: _stake };
}

function storeTupleAgreement(source: Agreement) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeAddress(source.customer);
	builder.writeNumber(source.token);
	builder.writeNumber(source.agreement_duration);
	builder.writeNumber(source.price_per_hour);
	builder.writeNumber(source.stake);
	return builder.build();
}

function dictValueParserAgreement(): DictionaryValue<Agreement> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeAgreement(src)).endCell());
			},
			parse: (src) => {
					return loadAgreement(src.loadRef().beginParse());
			}
	}
}

export type DeleteCustomer = {
	$$type: 'DeleteCustomer';
	customer: Address;
}

export function storeDeleteCustomer(src: DeleteCustomer) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(2767238765, 32);
			b_0.storeAddress(src.customer);
	};
}

export function loadDeleteCustomer(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 2767238765) { throw Error('Invalid prefix'); }
	let _customer = sc_0.loadAddress();
	return { $$type: 'DeleteCustomer' as const, customer: _customer };
}

function loadTupleDeleteCustomer(source: TupleReader) {
	let _customer = source.readAddress();
	return { $$type: 'DeleteCustomer' as const, customer: _customer };
}

function loadGetterTupleDeleteCustomer(source: TupleReader) {
	let _customer = source.readAddress();
	return { $$type: 'DeleteCustomer' as const, customer: _customer };
}

function storeTupleDeleteCustomer(source: DeleteCustomer) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.customer);
	return builder.build();
}

function dictValueParserDeleteCustomer(): DictionaryValue<DeleteCustomer> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeDeleteCustomer(src)).endCell());
			},
			parse: (src) => {
					return loadDeleteCustomer(src.loadRef().beginParse());
			}
	}
}

export type AddCustomer = {
	$$type: 'AddCustomer';
	agreement_infos: AgreementInfos;
}

export function storeAddCustomer(src: AddCustomer) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(3941065015, 32);
			b_0.store(storeAgreementInfos(src.agreement_infos));
	};
}

export function loadAddCustomer(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 3941065015) { throw Error('Invalid prefix'); }
	let _agreement_infos = loadAgreementInfos(sc_0);
	return { $$type: 'AddCustomer' as const, agreement_infos: _agreement_infos };
}

function loadTupleAddCustomer(source: TupleReader) {
	const _agreement_infos = loadTupleAgreementInfos(source);
	return { $$type: 'AddCustomer' as const, agreement_infos: _agreement_infos };
}

function loadGetterTupleAddCustomer(source: TupleReader) {
	const _agreement_infos = loadGetterTupleAgreementInfos(source);
	return { $$type: 'AddCustomer' as const, agreement_infos: _agreement_infos };
}

function storeTupleAddCustomer(source: AddCustomer) {
	let builder = new TupleBuilder();
	builder.writeTuple(storeTupleAgreementInfos(source.agreement_infos));
	return builder.build();
}

function dictValueParserAddCustomer(): DictionaryValue<AddCustomer> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeAddCustomer(src)).endCell());
			},
			parse: (src) => {
					return loadAddCustomer(src.loadRef().beginParse());
			}
	}
}

export type OwnerRequest = {
	$$type: 'OwnerRequest';
	owner: Address;
	customer: Address;
	fulfilled: boolean;
}

export function storeOwnerRequest(src: OwnerRequest) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(610803133, 32);
			b_0.storeAddress(src.owner);
			b_0.storeAddress(src.customer);
			b_0.storeBit(src.fulfilled);
	};
}

export function loadOwnerRequest(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 610803133) { throw Error('Invalid prefix'); }
	let _owner = sc_0.loadAddress();
	let _customer = sc_0.loadAddress();
	let _fulfilled = sc_0.loadBit();
	return { $$type: 'OwnerRequest' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled };
}

function loadTupleOwnerRequest(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _fulfilled = source.readBoolean();
	return { $$type: 'OwnerRequest' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled };
}

function loadGetterTupleOwnerRequest(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _fulfilled = source.readBoolean();
	return { $$type: 'OwnerRequest' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled };
}

function storeTupleOwnerRequest(source: OwnerRequest) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeAddress(source.customer);
	builder.writeBoolean(source.fulfilled);
	return builder.build();
}

function dictValueParserOwnerRequest(): DictionaryValue<OwnerRequest> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeOwnerRequest(src)).endCell());
			},
			parse: (src) => {
					return loadOwnerRequest(src.loadRef().beginParse());
			}
	}
}

export type AgreementEndValidation = {
	$$type: 'AgreementEndValidation';
	owner: Address;
	customer: Address;
	fulfilled: boolean;
	timeend: bigint;
}

export function storeAgreementEndValidation(src: AgreementEndValidation) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(3806442526, 32);
			b_0.storeAddress(src.owner);
			b_0.storeAddress(src.customer);
			b_0.storeBit(src.fulfilled);
			b_0.storeUint(src.timeend, 128);
	};
}

export function loadAgreementEndValidation(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 3806442526) { throw Error('Invalid prefix'); }
	let _owner = sc_0.loadAddress();
	let _customer = sc_0.loadAddress();
	let _fulfilled = sc_0.loadBit();
	let _timeend = sc_0.loadUintBig(128);
	return { $$type: 'AgreementEndValidation' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled, timeend: _timeend };
}

function loadTupleAgreementEndValidation(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _fulfilled = source.readBoolean();
	let _timeend = source.readBigNumber();
	return { $$type: 'AgreementEndValidation' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled, timeend: _timeend };
}

function loadGetterTupleAgreementEndValidation(source: TupleReader) {
	let _owner = source.readAddress();
	let _customer = source.readAddress();
	let _fulfilled = source.readBoolean();
	let _timeend = source.readBigNumber();
	return { $$type: 'AgreementEndValidation' as const, owner: _owner, customer: _customer, fulfilled: _fulfilled, timeend: _timeend };
}

function storeTupleAgreementEndValidation(source: AgreementEndValidation) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeAddress(source.customer);
	builder.writeBoolean(source.fulfilled);
	builder.writeNumber(source.timeend);
	return builder.build();
}

function dictValueParserAgreementEndValidation(): DictionaryValue<AgreementEndValidation> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeAgreementEndValidation(src)).endCell());
			},
			parse: (src) => {
					return loadAgreementEndValidation(src.loadRef().beginParse());
			}
	}
}

export type NftSummary = {
	$$type: 'NftSummary';
	owner: Address;
	productName: string;
	productDescription: string;
	productStake: bigint;
	descriptionImageUrl: string;
	productLocation: string;
	productHourPrice: bigint;
}

export function storeNftSummary(src: NftSummary) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeAddress(src.owner);
			b_0.storeStringRefTail(src.productName);
			b_0.storeStringRefTail(src.productDescription);
			b_0.storeInt(src.productStake, 257);
			let b_1 = new Builder();
			b_1.storeStringRefTail(src.descriptionImageUrl);
			b_1.storeStringRefTail(src.productLocation);
			b_1.storeInt(src.productHourPrice, 257);
			b_0.storeRef(b_1.endCell());
	};
}

export function loadNftSummary(slice: Slice) {
	let sc_0 = slice;
	let _owner = sc_0.loadAddress();
	let _productName = sc_0.loadStringRefTail();
	let _productDescription = sc_0.loadStringRefTail();
	let _productStake = sc_0.loadIntBig(257);
	let sc_1 = sc_0.loadRef().beginParse();
	let _descriptionImageUrl = sc_1.loadStringRefTail();
	let _productLocation = sc_1.loadStringRefTail();
	let _productHourPrice = sc_1.loadIntBig(257);
	return { $$type: 'NftSummary' as const, owner: _owner, productName: _productName, productDescription: _productDescription, productStake: _productStake, descriptionImageUrl: _descriptionImageUrl, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadTupleNftSummary(source: TupleReader) {
	let _owner = source.readAddress();
	let _productName = source.readString();
	let _productDescription = source.readString();
	let _productStake = source.readBigNumber();
	let _descriptionImageUrl = source.readString();
	let _productLocation = source.readString();
	let _productHourPrice = source.readBigNumber();
	return { $$type: 'NftSummary' as const, owner: _owner, productName: _productName, productDescription: _productDescription, productStake: _productStake, descriptionImageUrl: _descriptionImageUrl, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadGetterTupleNftSummary(source: TupleReader) {
	let _owner = source.readAddress();
	let _productName = source.readString();
	let _productDescription = source.readString();
	let _productStake = source.readBigNumber();
	let _descriptionImageUrl = source.readString();
	let _productLocation = source.readString();
	let _productHourPrice = source.readBigNumber();
	return { $$type: 'NftSummary' as const, owner: _owner, productName: _productName, productDescription: _productDescription, productStake: _productStake, descriptionImageUrl: _descriptionImageUrl, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function storeTupleNftSummary(source: NftSummary) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeString(source.productName);
	builder.writeString(source.productDescription);
	builder.writeNumber(source.productStake);
	builder.writeString(source.descriptionImageUrl);
	builder.writeString(source.productLocation);
	builder.writeNumber(source.productHourPrice);
	return builder.build();
}

function dictValueParserNftSummary(): DictionaryValue<NftSummary> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeNftSummary(src)).endCell());
			},
			parse: (src) => {
					return loadNftSummary(src.loadRef().beginParse());
			}
	}
}

export type InitNft = {
	$$type: 'InitNft';
	owner: Address;
	productName: string;
	productDescription: string;
	descriptionImageUrl: string;
	productStake: bigint;
	productLocation: string;
	productHourPrice: bigint;
}

export function storeInitNft(src: InitNft) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(3935032285, 32);
			b_0.storeAddress(src.owner);
			b_0.storeStringRefTail(src.productName);
			b_0.storeStringRefTail(src.productDescription);
			let b_1 = new Builder();
			b_1.storeStringRefTail(src.descriptionImageUrl);
			b_1.storeInt(src.productStake, 257);
			b_1.storeStringRefTail(src.productLocation);
			b_1.storeInt(src.productHourPrice, 257);
			b_0.storeRef(b_1.endCell());
	};
}

export function loadInitNft(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 3935032285) { throw Error('Invalid prefix'); }
	let _owner = sc_0.loadAddress();
	let _productName = sc_0.loadStringRefTail();
	let _productDescription = sc_0.loadStringRefTail();
	let sc_1 = sc_0.loadRef().beginParse();
	let _descriptionImageUrl = sc_1.loadStringRefTail();
	let _productStake = sc_1.loadIntBig(257);
	let _productLocation = sc_1.loadStringRefTail();
	let _productHourPrice = sc_1.loadIntBig(257);
	return { $$type: 'InitNft' as const, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadTupleInitNft(source: TupleReader) {
	let _owner = source.readAddress();
	let _productName = source.readString();
	let _productDescription = source.readString();
	let _descriptionImageUrl = source.readString();
	let _productStake = source.readBigNumber();
	let _productLocation = source.readString();
	let _productHourPrice = source.readBigNumber();
	return { $$type: 'InitNft' as const, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadGetterTupleInitNft(source: TupleReader) {
	let _owner = source.readAddress();
	let _productName = source.readString();
	let _productDescription = source.readString();
	let _descriptionImageUrl = source.readString();
	let _productStake = source.readBigNumber();
	let _productLocation = source.readString();
	let _productHourPrice = source.readBigNumber();
	return { $$type: 'InitNft' as const, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function storeTupleInitNft(source: InitNft) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.owner);
	builder.writeString(source.productName);
	builder.writeString(source.productDescription);
	builder.writeString(source.descriptionImageUrl);
	builder.writeNumber(source.productStake);
	builder.writeString(source.productLocation);
	builder.writeNumber(source.productHourPrice);
	return builder.build();
}

function dictValueParserInitNft(): DictionaryValue<InitNft> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeInitNft(src)).endCell());
			},
			parse: (src) => {
					return loadInitNft(src.loadRef().beginParse());
			}
	}
}

export type ReceiveFees = {
	$$type: 'ReceiveFees';
	customer: Address;
}

export function storeReceiveFees(src: ReceiveFees) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(4030857533, 32);
			b_0.storeAddress(src.customer);
	};
}

export function loadReceiveFees(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 4030857533) { throw Error('Invalid prefix'); }
	let _customer = sc_0.loadAddress();
	return { $$type: 'ReceiveFees' as const, customer: _customer };
}

function loadTupleReceiveFees(source: TupleReader) {
	let _customer = source.readAddress();
	return { $$type: 'ReceiveFees' as const, customer: _customer };
}

function loadGetterTupleReceiveFees(source: TupleReader) {
	let _customer = source.readAddress();
	return { $$type: 'ReceiveFees' as const, customer: _customer };
}

function storeTupleReceiveFees(source: ReceiveFees) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.customer);
	return builder.build();
}

function dictValueParserReceiveFees(): DictionaryValue<ReceiveFees> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeReceiveFees(src)).endCell());
			},
			parse: (src) => {
					return loadReceiveFees(src.loadRef().beginParse());
			}
	}
}

export type ChangeOwner = {
	$$type: 'ChangeOwner';
	newOwner: Address;
	nftId: bigint;
}

export function storeChangeOwner(src: ChangeOwner) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(1152761988, 32);
			b_0.storeAddress(src.newOwner);
			b_0.storeInt(src.nftId, 257);
	};
}

export function loadChangeOwner(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 1152761988) { throw Error('Invalid prefix'); }
	let _newOwner = sc_0.loadAddress();
	let _nftId = sc_0.loadIntBig(257);
	return { $$type: 'ChangeOwner' as const, newOwner: _newOwner, nftId: _nftId };
}

function loadTupleChangeOwner(source: TupleReader) {
	let _newOwner = source.readAddress();
	let _nftId = source.readBigNumber();
	return { $$type: 'ChangeOwner' as const, newOwner: _newOwner, nftId: _nftId };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
	let _newOwner = source.readAddress();
	let _nftId = source.readBigNumber();
	return { $$type: 'ChangeOwner' as const, newOwner: _newOwner, nftId: _nftId };
}

function storeTupleChangeOwner(source: ChangeOwner) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.newOwner);
	builder.writeNumber(source.nftId);
	return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
			},
			parse: (src) => {
					return loadChangeOwner(src.loadRef().beginParse());
			}
	}
}

export type CheckNftExists = {
	$$type: 'CheckNftExists';
	nftId: bigint;
}

export function storeCheckNftExists(src: CheckNftExists) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(1878244349, 32);
			b_0.storeInt(src.nftId, 257);
	};
}

export function loadCheckNftExists(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 1878244349) { throw Error('Invalid prefix'); }
	let _nftId = sc_0.loadIntBig(257);
	return { $$type: 'CheckNftExists' as const, nftId: _nftId };
}

function loadTupleCheckNftExists(source: TupleReader) {
	let _nftId = source.readBigNumber();
	return { $$type: 'CheckNftExists' as const, nftId: _nftId };
}

function loadGetterTupleCheckNftExists(source: TupleReader) {
	let _nftId = source.readBigNumber();
	return { $$type: 'CheckNftExists' as const, nftId: _nftId };
}

function storeTupleCheckNftExists(source: CheckNftExists) {
	let builder = new TupleBuilder();
	builder.writeNumber(source.nftId);
	return builder.build();
}

function dictValueParserCheckNftExists(): DictionaryValue<CheckNftExists> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeCheckNftExists(src)).endCell());
			},
			parse: (src) => {
					return loadCheckNftExists(src.loadRef().beginParse());
			}
	}
}

export type UpdateProductProperties = {
	$$type: 'UpdateProductProperties';
	productName: string | null;
	productDescription: string | null;
	descriptionImageUrl: string | null;
	productStake: bigint | null;
	productLocation: string | null;
	productHourPrice: bigint | null;
}

export function storeUpdateProductProperties(src: UpdateProductProperties) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeUint(2312634055, 32);
			if (src.productName !== null && src.productName !== undefined) { b_0.storeBit(true).storeStringRefTail(src.productName); } else { b_0.storeBit(false); }
			if (src.productDescription !== null && src.productDescription !== undefined) { b_0.storeBit(true).storeStringRefTail(src.productDescription); } else { b_0.storeBit(false); }
			let b_1 = new Builder();
			if (src.descriptionImageUrl !== null && src.descriptionImageUrl !== undefined) { b_1.storeBit(true).storeStringRefTail(src.descriptionImageUrl); } else { b_1.storeBit(false); }
			if (src.productStake !== null && src.productStake !== undefined) { b_1.storeBit(true).storeInt(src.productStake, 257); } else { b_1.storeBit(false); }
			if (src.productLocation !== null && src.productLocation !== undefined) { b_1.storeBit(true).storeStringRefTail(src.productLocation); } else { b_1.storeBit(false); }
			if (src.productHourPrice !== null && src.productHourPrice !== undefined) { b_1.storeBit(true).storeInt(src.productHourPrice, 257); } else { b_1.storeBit(false); }
			b_0.storeRef(b_1.endCell());
	};
}

export function loadUpdateProductProperties(slice: Slice) {
	let sc_0 = slice;
	if (sc_0.loadUint(32) !== 2312634055) { throw Error('Invalid prefix'); }
	let _productName = sc_0.loadBit() ? sc_0.loadStringRefTail() : null;
	let _productDescription = sc_0.loadBit() ? sc_0.loadStringRefTail() : null;
	let sc_1 = sc_0.loadRef().beginParse();
	let _descriptionImageUrl = sc_1.loadBit() ? sc_1.loadStringRefTail() : null;
	let _productStake = sc_1.loadBit() ? sc_1.loadIntBig(257) : null;
	let _productLocation = sc_1.loadBit() ? sc_1.loadStringRefTail() : null;
	let _productHourPrice = sc_1.loadBit() ? sc_1.loadIntBig(257) : null;
	return { $$type: 'UpdateProductProperties' as const, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadTupleUpdateProductProperties(source: TupleReader) {
	let _productName = source.readStringOpt();
	let _productDescription = source.readStringOpt();
	let _descriptionImageUrl = source.readStringOpt();
	let _productStake = source.readBigNumberOpt();
	let _productLocation = source.readStringOpt();
	let _productHourPrice = source.readBigNumberOpt();
	return { $$type: 'UpdateProductProperties' as const, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadGetterTupleUpdateProductProperties(source: TupleReader) {
	let _productName = source.readStringOpt();
	let _productDescription = source.readStringOpt();
	let _descriptionImageUrl = source.readStringOpt();
	let _productStake = source.readBigNumberOpt();
	let _productLocation = source.readStringOpt();
	let _productHourPrice = source.readBigNumberOpt();
	return { $$type: 'UpdateProductProperties' as const, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function storeTupleUpdateProductProperties(source: UpdateProductProperties) {
	let builder = new TupleBuilder();
	builder.writeString(source.productName);
	builder.writeString(source.productDescription);
	builder.writeString(source.descriptionImageUrl);
	builder.writeNumber(source.productStake);
	builder.writeString(source.productLocation);
	builder.writeNumber(source.productHourPrice);
	return builder.build();
}

function dictValueParserUpdateProductProperties(): DictionaryValue<UpdateProductProperties> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeUpdateProductProperties(src)).endCell());
			},
			parse: (src) => {
					return loadUpdateProductProperties(src.loadRef().beginParse());
			}
	}
}

export type ProductNft$Data = {
	$$type: 'ProductNft$Data';
	productOwner: Address;
	curNftId: bigint;
}

export function storeProductNft$Data(src: ProductNft$Data) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeAddress(src.productOwner);
			b_0.storeInt(src.curNftId, 257);
	};
}

export function loadProductNft$Data(slice: Slice) {
	let sc_0 = slice;
	let _productOwner = sc_0.loadAddress();
	let _curNftId = sc_0.loadIntBig(257);
	return { $$type: 'ProductNft$Data' as const, productOwner: _productOwner, curNftId: _curNftId };
}

function loadTupleProductNft$Data(source: TupleReader) {
	let _productOwner = source.readAddress();
	let _curNftId = source.readBigNumber();
	return { $$type: 'ProductNft$Data' as const, productOwner: _productOwner, curNftId: _curNftId };
}

function loadGetterTupleProductNft$Data(source: TupleReader) {
	let _productOwner = source.readAddress();
	let _curNftId = source.readBigNumber();
	return { $$type: 'ProductNft$Data' as const, productOwner: _productOwner, curNftId: _curNftId };
}

function storeTupleProductNft$Data(source: ProductNft$Data) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.productOwner);
	builder.writeNumber(source.curNftId);
	return builder.build();
}

function dictValueParserProductNft$Data(): DictionaryValue<ProductNft$Data> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeProductNft$Data(src)).endCell());
			},
			parse: (src) => {
					return loadProductNft$Data(src.loadRef().beginParse());
			}
	}
}

export type Nft$Data = {
	$$type: 'Nft$Data';
	parent_contract: Address;
	initDone: boolean;
	summary: NftSummary | null;
	owner: Address | null;
	productName: string | null;
	productDescription: string | null;
	descriptionImageUrl: string | null;
	productStake: bigint | null;
	productLocation: string | null;
	productHourPrice: bigint | null;
}

export function storeNft$Data(src: Nft$Data) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeAddress(src.parent_contract);
			b_0.storeBit(src.initDone);
			let b_1 = new Builder();
			if (src.summary !== null && src.summary !== undefined) { b_1.storeBit(true); b_1.store(storeNftSummary(src.summary)); } else { b_1.storeBit(false); }
			b_1.storeAddress(src.owner);
			let b_2 = new Builder();
			if (src.productName !== null && src.productName !== undefined) { b_2.storeBit(true).storeStringRefTail(src.productName); } else { b_2.storeBit(false); }
			if (src.productDescription !== null && src.productDescription !== undefined) { b_2.storeBit(true).storeStringRefTail(src.productDescription); } else { b_2.storeBit(false); }
			if (src.descriptionImageUrl !== null && src.descriptionImageUrl !== undefined) { b_2.storeBit(true).storeStringRefTail(src.descriptionImageUrl); } else { b_2.storeBit(false); }
			if (src.productStake !== null && src.productStake !== undefined) { b_2.storeBit(true).storeInt(src.productStake, 257); } else { b_2.storeBit(false); }
			if (src.productLocation !== null && src.productLocation !== undefined) { b_2.storeBit(true).storeStringRefTail(src.productLocation); } else { b_2.storeBit(false); }
			if (src.productHourPrice !== null && src.productHourPrice !== undefined) { b_2.storeBit(true).storeInt(src.productHourPrice, 257); } else { b_2.storeBit(false); }
			b_1.storeRef(b_2.endCell());
			b_0.storeRef(b_1.endCell());
	};
}

export function loadNft$Data(slice: Slice) {
	let sc_0 = slice;
	let _parent_contract = sc_0.loadAddress();
	let _initDone = sc_0.loadBit();
	let sc_1 = sc_0.loadRef().beginParse();
	let _summary = sc_1.loadBit() ? loadNftSummary(sc_1) : null;
	let _owner = sc_1.loadMaybeAddress();
	let sc_2 = sc_1.loadRef().beginParse();
	let _productName = sc_2.loadBit() ? sc_2.loadStringRefTail() : null;
	let _productDescription = sc_2.loadBit() ? sc_2.loadStringRefTail() : null;
	let _descriptionImageUrl = sc_2.loadBit() ? sc_2.loadStringRefTail() : null;
	let _productStake = sc_2.loadBit() ? sc_2.loadIntBig(257) : null;
	let _productLocation = sc_2.loadBit() ? sc_2.loadStringRefTail() : null;
	let _productHourPrice = sc_2.loadBit() ? sc_2.loadIntBig(257) : null;
	return { $$type: 'Nft$Data' as const, parent_contract: _parent_contract, initDone: _initDone, summary: _summary, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadTupleNft$Data(source: TupleReader) {
	let _parent_contract = source.readAddress();
	let _initDone = source.readBoolean();
	const _summary_p = source.readTupleOpt();
	const _summary = _summary_p ? loadTupleNftSummary(_summary_p) : null;
	let _owner = source.readAddressOpt();
	let _productName = source.readStringOpt();
	let _productDescription = source.readStringOpt();
	let _descriptionImageUrl = source.readStringOpt();
	let _productStake = source.readBigNumberOpt();
	let _productLocation = source.readStringOpt();
	let _productHourPrice = source.readBigNumberOpt();
	return { $$type: 'Nft$Data' as const, parent_contract: _parent_contract, initDone: _initDone, summary: _summary, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function loadGetterTupleNft$Data(source: TupleReader) {
	let _parent_contract = source.readAddress();
	let _initDone = source.readBoolean();
	const _summary_p = source.readTupleOpt();
	const _summary = _summary_p ? loadTupleNftSummary(_summary_p) : null;
	let _owner = source.readAddressOpt();
	let _productName = source.readStringOpt();
	let _productDescription = source.readStringOpt();
	let _descriptionImageUrl = source.readStringOpt();
	let _productStake = source.readBigNumberOpt();
	let _productLocation = source.readStringOpt();
	let _productHourPrice = source.readBigNumberOpt();
	return { $$type: 'Nft$Data' as const, parent_contract: _parent_contract, initDone: _initDone, summary: _summary, owner: _owner, productName: _productName, productDescription: _productDescription, descriptionImageUrl: _descriptionImageUrl, productStake: _productStake, productLocation: _productLocation, productHourPrice: _productHourPrice };
}

function storeTupleNft$Data(source: Nft$Data) {
	let builder = new TupleBuilder();
	builder.writeAddress(source.parent_contract);
	builder.writeBoolean(source.initDone);
	if (source.summary !== null && source.summary !== undefined) {
			builder.writeTuple(storeTupleNftSummary(source.summary));
	} else {
			builder.writeTuple(null);
	}
	builder.writeAddress(source.owner);
	builder.writeString(source.productName);
	builder.writeString(source.productDescription);
	builder.writeString(source.descriptionImageUrl);
	builder.writeNumber(source.productStake);
	builder.writeString(source.productLocation);
	builder.writeNumber(source.productHourPrice);
	return builder.build();
}

function dictValueParserNft$Data(): DictionaryValue<Nft$Data> {
	return {
			serialize: (src, builder) => {
					builder.storeRef(beginCell().store(storeNft$Data(src)).endCell());
			},
			parse: (src) => {
					return loadNft$Data(src.loadRef().beginParse());
			}
	}
}

type Nft_init_args = {
	$$type: 'Nft_init_args';
	_parent_contract: Address;
	_value: bigint;
}

function initNft_init_args(src: Nft_init_args) {
	return (builder: Builder) => {
			let b_0 = builder;
			b_0.storeAddress(src._parent_contract);
			b_0.storeInt(src._value, 257);
	};
}

async function Nft_init(_parent_contract: Address, _value: bigint) {
	const __code = Cell.fromBase64('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');
	const __system = Cell.fromBase64('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');
	let builder = beginCell();
	builder.storeRef(__system);
	builder.storeUint(0, 1);
	initNft_init_args({ $$type: 'Nft_init_args', _parent_contract, _value })(builder);
	const __data = builder.endCell();
	return { code: __code, data: __data };
}

const Nft_errors: { [key: number]: { message: string } } = {
	2: { message: `Stack underflow` },
	3: { message: `Stack overflow` },
	4: { message: `Integer overflow` },
	5: { message: `Integer out of expected range` },
	6: { message: `Invalid opcode` },
	7: { message: `Type check error` },
	8: { message: `Cell overflow` },
	9: { message: `Cell underflow` },
	10: { message: `Dictionary error` },
	11: { message: `'Unknown' error` },
	12: { message: `Fatal error` },
	13: { message: `Out of gas error` },
	14: { message: `Virtualization error` },
	32: { message: `Action list is invalid` },
	33: { message: `Action list is too long` },
	34: { message: `Action is invalid or not supported` },
	35: { message: `Invalid source address in outbound message` },
	36: { message: `Invalid destination address in outbound message` },
	37: { message: `Not enough TON` },
	38: { message: `Not enough extra-currencies` },
	39: { message: `Outbound message does not fit into a cell after rewriting` },
	40: { message: `Cannot process a message` },
	41: { message: `Library reference is null` },
	42: { message: `Library change action error` },
	43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
	50: { message: `Account state size exceeded limits` },
	128: { message: `Null reference exception` },
	129: { message: `Invalid serialization prefix` },
	130: { message: `Invalid incoming message` },
	131: { message: `Constraints error` },
	132: { message: `Access denied` },
	133: { message: `Contract stopped` },
	134: { message: `Invalid argument` },
	135: { message: `Code of a contract was not found` },
	136: { message: `Invalid address` },
	137: { message: `Masterchain support is not enabled for this contract` },
	7657: { message: `Not initialized` },
	45667: { message: `Init already done` },
	63086: { message: `Only parent can end the rent` },
}

const Nft_types: ABIType[] = [
	{"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
	{"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
	{"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
	{"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
	{"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
	{"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
	{"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
	{"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
	{"name":"AgreementInfos","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"customer","type":{"kind":"simple","type":"address","optional":false}},{"name":"token","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"timestart","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"timeend","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"agreement_duration","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"price_per_hour","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"stake","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"has_staked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner_claimed","type":{"kind":"simple","type":"bool","optional":false}}]},
	{"name":"Agreement","header":2413122805,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"customer","type":{"kind":"simple","type":"address","optional":false}},{"name":"token","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"agreement_duration","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"price_per_hour","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"stake","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
	{"name":"DeleteCustomer","header":2767238765,"fields":[{"name":"customer","type":{"kind":"simple","type":"address","optional":false}}]},
	{"name":"AddCustomer","header":3941065015,"fields":[{"name":"agreement_infos","type":{"kind":"simple","type":"AgreementInfos","optional":false}}]},
	{"name":"OwnerRequest","header":610803133,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"customer","type":{"kind":"simple","type":"address","optional":false}},{"name":"fulfilled","type":{"kind":"simple","type":"bool","optional":false}}]},
	{"name":"AgreementEndValidation","header":3806442526,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"customer","type":{"kind":"simple","type":"address","optional":false}},{"name":"fulfilled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"timeend","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
	{"name":"NftSummary","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"productName","type":{"kind":"simple","type":"string","optional":false}},{"name":"productDescription","type":{"kind":"simple","type":"string","optional":false}},{"name":"productStake","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"descriptionImageUrl","type":{"kind":"simple","type":"string","optional":false}},{"name":"productLocation","type":{"kind":"simple","type":"string","optional":false}},{"name":"productHourPrice","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
	{"name":"InitNft","header":3935032285,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"productName","type":{"kind":"simple","type":"string","optional":false}},{"name":"productDescription","type":{"kind":"simple","type":"string","optional":false}},{"name":"descriptionImageUrl","type":{"kind":"simple","type":"string","optional":false}},{"name":"productStake","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"productLocation","type":{"kind":"simple","type":"string","optional":false}},{"name":"productHourPrice","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
	{"name":"ReceiveFees","header":4030857533,"fields":[{"name":"customer","type":{"kind":"simple","type":"address","optional":false}}]},
	{"name":"ChangeOwner","header":1152761988,"fields":[{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"nftId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
	{"name":"CheckNftExists","header":1878244349,"fields":[{"name":"nftId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
	{"name":"UpdateProductProperties","header":2312634055,"fields":[{"name":"productName","type":{"kind":"simple","type":"string","optional":true}},{"name":"productDescription","type":{"kind":"simple","type":"string","optional":true}},{"name":"descriptionImageUrl","type":{"kind":"simple","type":"string","optional":true}},{"name":"productStake","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"productLocation","type":{"kind":"simple","type":"string","optional":true}},{"name":"productHourPrice","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
	{"name":"ProductNft$Data","header":null,"fields":[{"name":"productOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"curNftId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
	{"name":"Nft$Data","header":null,"fields":[{"name":"parent_contract","type":{"kind":"simple","type":"address","optional":false}},{"name":"initDone","type":{"kind":"simple","type":"bool","optional":false}},{"name":"summary","type":{"kind":"simple","type":"NftSummary","optional":true}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"productName","type":{"kind":"simple","type":"string","optional":true}},{"name":"productDescription","type":{"kind":"simple","type":"string","optional":true}},{"name":"descriptionImageUrl","type":{"kind":"simple","type":"string","optional":true}},{"name":"productStake","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"productLocation","type":{"kind":"simple","type":"string","optional":true}},{"name":"productHourPrice","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
]

const Nft_getters: ABIGetter[] = [
	{"name":"summary","arguments":[],"returnType":{"kind":"simple","type":"NftSummary","optional":false}},
]

export const Nft_getterMapping: { [key: string]: string } = {
	'summary': 'getSummary',
}

const Nft_receivers: ABIReceiver[] = [
	{"receiver":"internal","message":{"kind":"typed","type":"InitNft"}},
	{"receiver":"internal","message":{"kind":"typed","type":"UpdateProductProperties"}},
	{"receiver":"internal","message":{"kind":"typed","type":"ChangeOwner"}},
	{"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class Nft implements Contract {
	
	static async init(_parent_contract: Address, _value: bigint) {
			return await Nft_init(_parent_contract, _value);
	}
	
	static async fromInit(_parent_contract: Address, _value: bigint) {
			const init = await Nft_init(_parent_contract, _value);
			const address = contractAddress(0, init);
			return new Nft(address, init);
	}
	
	static fromAddress(address: Address) {
			return new Nft(address);
	}
	
	readonly address: Address; 
	readonly init?: { code: Cell, data: Cell };
	readonly abi: ContractABI = {
			types:  Nft_types,
			getters: Nft_getters,
			receivers: Nft_receivers,
			errors: Nft_errors,
	};
	
	private constructor(address: Address, init?: { code: Cell, data: Cell }) {
			this.address = address;
			this.init = init;
	}
	
	async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: InitNft | UpdateProductProperties | ChangeOwner | Deploy) {
			
			let body: Cell | null = null;
			if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'InitNft') {
					body = beginCell().store(storeInitNft(message)).endCell();
			}
			if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateProductProperties') {
					body = beginCell().store(storeUpdateProductProperties(message)).endCell();
			}
			if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ChangeOwner') {
					body = beginCell().store(storeChangeOwner(message)).endCell();
			}
			if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
					body = beginCell().store(storeDeploy(message)).endCell();
			}
			if (body === null) { throw new Error('Invalid message type'); }
			
			await provider.internal(via, { ...args, body: body });
			
	}
	
	async getSummary(provider: ContractProvider) {
			let builder = new TupleBuilder();
			let source = (await provider.get('summary', builder.build())).stack;
			const result = loadGetterTupleNftSummary(source);
			return result;
	}
	
}