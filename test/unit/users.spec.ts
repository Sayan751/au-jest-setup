import { bootstrap } from "aurelia-bootstrapper";
import { HttpClient } from 'aurelia-fetch-client';
import { ComponentTester, StageComponent } from "aurelia-testing";
import { Users } from '../../src/users';
import { Aurelia } from "aurelia-framework";

class HttpStub {
  items: any[];

  fetch(url) {
    return new Promise(resolve => {
      resolve({ json: () => this.items });
    });
  }

  configure(func) { }
}

function createHttpStub(): any {
  return new HttpStub();
}

describe.only('the Users module', () => {

  it('sets fetch response to users', (done) => {
    var http = createHttpStub(),
      sut = new Users(<HttpClient>http),
      itemStubs = [1],
      itemFake = [2];

    http.items = itemStubs;

    sut.activate().then(() => {
      expect(sut.users).toBe(itemStubs);
      expect(sut.users).not.toBe(itemFake);
      done();
    });
  });

  it.only("attempt to test ui", async () => {
    // let actualFetch;

    // jest.mock("aurelia-fetch-client", function () {
    //   const { HttpClient: mockHttpClient } = jest.requireActual("aurelia-fetch-client");

    //   actualFetch = mockHttpClient.prototype.fetch;
    //   mockHttpClient.prototype.fetch = function () { return []; }

    //   return mockHttpClient
    // });
    // jest.mock("aurelia-fetch-client");

    const component: ComponentTester<Users> = StageComponent
      .withResources("users")
      .inView(`<users></users>`);

    component.bootstrap((aurelia: Aurelia) => {
      const config = aurelia.use.standardConfiguration();

      aurelia.container.registerInstance(HttpClient, new HttpStub());
      return config;
    });

    await component.create(bootstrap);


    const { viewModel, element } = component;
    expect(viewModel).toBeDefined();
    expect(element).toBeDefined();
    expect(!!element.querySelector("section h2")).toBe(true)

    // HttpClient.prototype.fetch = actualFetch;
  });
});
