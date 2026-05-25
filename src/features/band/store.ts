import { create } from "zustand";
import type { Instrument, InstrumentId } from "@/shared/types/common";
import { INSTRUMENT_LIBRARY } from "@/features/templates/data";

interface BandStore {
  activeIds: InstrumentId[];
  activeInstruments: Instrument[];
  toggleInstrument: (id: InstrumentId) => void;
  addInstrument: (id: InstrumentId) => void;
  removeInstrument: (id: InstrumentId) => void;
  clearBand: () => void;
}

export const useBandStore = create<BandStore>((set, get) => ({
  activeIds: [],
  activeInstruments: [],

  toggleInstrument(id) {
    const { activeIds } = get();
    if (activeIds.includes(id)) {
      get().removeInstrument(id);
    } else {
      get().addInstrument(id);
    }
  },

  addInstrument(id) {
    const { activeIds, activeInstruments } = get();
    if (activeIds.includes(id)) return;
    const instrument = INSTRUMENT_LIBRARY.find((i) => i.id === id);
    if (!instrument) return;
    set({
      activeIds: [...activeIds, id],
      activeInstruments: [...activeInstruments, instrument],
    });
  },

  removeInstrument(id) {
    const { activeIds, activeInstruments } = get();
    set({
      activeIds: activeIds.filter((i) => i !== id),
      activeInstruments: activeInstruments.filter((i) => i.id !== id),
    });
  },

  clearBand() {
    set({ activeIds: [], activeInstruments: [] });
  },
}));
