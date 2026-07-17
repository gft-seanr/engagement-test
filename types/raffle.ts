declare global {
  interface RaffleParams {
    id: string;
    targetId: string;
    programId: string;
    drawCount: string;
  }

  //todo: Add interface for Raffle error

  interface RaffleData {
    totalCount: string;
    tokens: Token[];
  }

  interface RaffleResponse extends BaseResponse<RaffleData> {}
}

export type {};
