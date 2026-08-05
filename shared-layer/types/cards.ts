declare global {
  interface CardParams {
    id: string;
  }

  type CardErrorCode = ServerErrorCode; // add any card-specific error codes here if needed;

  interface CardError extends BaseError<CardErrorCode> {}

  interface Card {
    accountNo: string;
    cardType: string;
    last4: string;
    activatedDateTime: string;
  }

  interface CardData {
    cards: Card[];
    user: Card[]; //todo to be removed
  }

  interface CardResponse extends BaseResponse<CardData, CardError> {}
}

export type {};
