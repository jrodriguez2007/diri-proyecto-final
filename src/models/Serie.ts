export interface Serie {
    id: string; 
    idDocument: string;     // PK
    idSerie: string;        // PK
    number: number;
    currentNumber: number;
    sizeText: number;
    status: boolean;
}