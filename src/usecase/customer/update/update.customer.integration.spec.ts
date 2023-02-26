import { Sequelize } from "sequelize-typescript";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "../create/create.customer.usecase";
import UpdateCustomerUseCase from "./update.customer.usecase";
const customer = CustomerFactory.createWithAddress(
  "John",
  new Address("Street", 123, "Zip", "City")
);

const input = {
  id: customer.id,
  name: "John Updated",
  address: {
    street: "Street Updated",
    number: 1234,
    zip: "Zip Updated",
    city: "City Updated",
  },
};

describe("Integration test for customer update use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    const outputCreate = await customerCreateUseCase.execute(customer);

    const outputUpdate = await customerUpdateUseCase.execute(outputCreate);

    expect(outputUpdate).toEqual(outputCreate);
  });
});
