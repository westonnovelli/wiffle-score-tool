import { EMPTY_BASES } from "../factory";
import { Bases } from "../types";
import advanceRunners from "./advanceRunners";

const {
    FIRST,
    SECOND,
    THIRD,
    HOME
} = Bases;

describe('[empty]', () => {
    test('000.1 => 000.0', () => {
        const initial = { ...EMPTY_BASES };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES });
    });

    test('000.2 => 000.0', () => {
        const initial = { ...EMPTY_BASES };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES });
    });

    test('000.3 => 000.0', () => {
        const initial = { ...EMPTY_BASES };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES });
    });

    test('000.4 => 000.0', () => {
        const initial = { ...EMPTY_BASES };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });
});

describe('[runner on first]', () => {
    test('100.1 => 020.0', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [SECOND]: 1 });
    });

    test('100.2 => 003.0', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [THIRD]: 1 });
    });

    test('100.3 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('100.4 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });
});

describe('[runner on second]', () => {
    test('020.1 => 003.0', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [THIRD]: 1 });
    });

    test('020.2 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('020.3 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('020.4 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });
});

describe('[runner on third]', () => {
    test('003.1 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [THIRD]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('003.2 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [THIRD]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('003.3 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [THIRD]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
    });

    test('003.4 => 000.1', () => {
        const initial = { ...EMPTY_BASES, [THIRD]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });
});

describe('[runner on first and second]', () => {
    test('120.1 => 023.0', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 });
    });

    test('120.2 => 003.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 1 });
    });

    test('120.3 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });

    test('120.4 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
    });
});

describe('[runner on first and third]', () => {
    test('103.1 => 020.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [HOME]: 1 });
    });

    test('103.2 => 003.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 1 });
    });

    test('103.3 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });

    test('103.4 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
    });
});

describe('[runner on second and third]', () => {
    test('023.1 => 003.1', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 1 });
    });

    test('023.2 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });

    test('023.3 => 000.2', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
    });

    test('023.4 => 000.3', () => {
        const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
    });
});

describe('[bases loaded]', () => {
    test('123.1 => 023.1', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 1)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1, [HOME]: 1 });
    });

    test('123.2 => 003.2', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 2)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 2 });
    });

    test('123.3 => 000.3', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 3)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
    });

    test('123.4 => 000.4', () => {
        const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
        expect(advanceRunners(initial, 4)).toEqual({ ...EMPTY_BASES, [HOME]: 4 });
    });
});

describe('with unforcedAdvancement', () => {
    describe('[empty]', () => {
        test('000.1 => 000.0', () => {
            const initial = { ...EMPTY_BASES };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES });
        });
    
        test('000.2 => 000.0', () => {
            const initial = { ...EMPTY_BASES };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES });
        });
    
        test('000.3 => 000.0', () => {
            const initial = { ...EMPTY_BASES };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES });
        });
    
        test('000.4 => 000.0', () => {
            const initial = { ...EMPTY_BASES };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    });
    
    describe('[runner on first]', () => {
        test('100.1 => 020.0', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1 });
        });
    
        test('100.2 => 003.0', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [THIRD]: 1 });
        });
    
        test('100.3 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    
        test('100.4 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    });
    
    describe('[runner on second]', () => {
        test('020.1 => 020.0', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1 });
        });
    
        test('020.2 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    
        test('020.3 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    
        test('020.4 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    });
    
    describe('[runner on third]', () => {
        test('003.1 => 003.1', () => {
            const initial = { ...EMPTY_BASES, [THIRD]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [THIRD]: 1 });
        });
    
        test('003.2 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [THIRD]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    
        test('003.3 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [THIRD]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 1 });
        });
    
        test('003.4 => 000.1', () => {
            const initial = { ...EMPTY_BASES, [THIRD]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    });
    
    describe('[runner on first and second]', () => {
        test('120.1 => 023.0', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 });
        });
    
        test('120.2 => 003.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 1 });
        });
    
        test('120.3 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    
        test('120.4 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
        });
    });
    
    describe('[runner on first and third]', () => {
        test('103.1 => 023.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 });
        });
    
        test('103.2 => 003.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 1 });
        });
    
        test('103.3 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    
        test('103.4 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
        });
    });
    
    describe('[runner on second and third]', () => {
        test('023.1 => 023.1', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 });
        });
    
        test('023.2 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    
        test('023.3 => 000.2', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 2 });
        });
    
        test('023.4 => 000.3', () => {
            const initial = { ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
        });
    });
    
    describe('[bases loaded]', () => {
        test('123.1 => 023.1', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 1, false)).toEqual({ ...EMPTY_BASES, [SECOND]: 1, [THIRD]: 1, [HOME]: 1 });
        });
    
        test('123.2 => 003.2', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 2, false)).toEqual({ ...EMPTY_BASES, [THIRD]: 1, [HOME]: 2 });
        });
    
        test('123.3 => 000.3', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 3, false)).toEqual({ ...EMPTY_BASES, [HOME]: 3 });
        });
    
        test('123.4 => 000.4', () => {
            const initial = { ...EMPTY_BASES, [FIRST]: 1, [SECOND]: 1, [THIRD]: 1 };
            expect(advanceRunners(initial, 4, false)).toEqual({ ...EMPTY_BASES, [HOME]: 4 });
        });
    });
});