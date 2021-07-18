export type KeepStyleBtnPropType = {
  btnName: string;
  BtnType: any;
  action: any;
  success: any;
  failure: any;
  customize: CustomizeInput; 
};

export type CustomizeInput = {

}; 


// State values
export type KeepStyleBtnProperty = {
  btnName: string;
  ksbState: KsbState;
}

export type KsbState = "idle" | "loading" | "fail" | "OK";
