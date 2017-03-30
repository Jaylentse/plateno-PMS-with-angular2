export abstract class BaseRequest {
  
  async test() { 
    await new Promise(resolve => { resolve(0)});
  }
}