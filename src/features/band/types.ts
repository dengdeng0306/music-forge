import type { Instrument, InstrumentCategory, InstrumentId } from "@/shared/types/common";

export type { Instrument, InstrumentCategory, InstrumentId };

export interface BandState {
  instruments: Instrument[];
  activeInstrumentIds: InstrumentId[];
}
