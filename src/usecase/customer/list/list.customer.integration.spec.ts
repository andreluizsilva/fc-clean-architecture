import { Sequelize } from "sequelize-typescript";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "../create/create.customer.usecase";
import ListCustomerUseCase from "./list.customer.usecase";
const customer1 = {
  name: "John Doe",
  address: new Address("Street 1", 1, "12345", "City")
}  

const customer2 = {
  name:  "Jane Doe",
  address: new Address("Street 2", 2, "123456", "City 2")
}

describe("Integration test for listing customer use case", () => {
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
  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    const createUseCase = new CreateCustomerUseCase(customerRepository)
    const listUseCase = new ListCustomerUseCase(customerRepository);

    const outputCreateCustomer1 = await createUseCase.execute(customer1);
    const outputCreateCustomer2 = await createUseCase.execute(customer2);

    const outputList = await listUseCase.execute({});

    expect(outputList.customers.length).toBe(2);
    expect(outputList.customers[0].id).toBe(outputCreateCustomer1.id);
    expect(outputList.customers[0].name).toBe(outputCreateCustomer1.name);
    expect(outputList.customers[0].address.street).toBe(outputCreateCustomer1.address.street);
    expect(outputList.customers[1].id).toBe(outputCreateCustomer2.id);
    expect(outputList.customers[1].name).toBe(outputCreateCustomer2.name);
    expect(outputList.customers[1].address.street).toBe(outputCreateCustomer2.address.street);
  });
});
