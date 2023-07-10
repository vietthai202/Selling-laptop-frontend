/* eslint-disable @typescript-eslint/no-unused-vars */
const password: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[^\da-zA-Z]).{6,}$/;
const email: RegExp =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const phone: RegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const numberReg: RegExp = /^[0-9]$/;

export { password, email, phone, numberReg };
