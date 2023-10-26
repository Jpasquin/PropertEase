export default interface Filter {
  type: string;
  city: string;
  province: string;
  minMaxPrice: any;
  tags?: string[];
  brokerToken?: string;
}
