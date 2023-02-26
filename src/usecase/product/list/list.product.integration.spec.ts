import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";

const product1 = {
    id: 1,
    name: "Product 1",
    price: 30
}  

const product2 = {
    id: 2,
    name: "Product 2",
    price: 60
}  

describe("Integration test for listing product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should list a customer", async () => {
    const productRepository = new ProductRepository();
    const createUseCase = new CreateProductUseCase(productRepository)
    const listUseCase = new ListProductUseCase(productRepository);

    const outputCreateProduct1 = await createUseCase.execute(product1);
    const outputCreateProduct2 = await createUseCase.execute(product2);

    const outputList = await listUseCase.execute({});

    expect(outputList.products.length).toBe(2);
    expect(outputList.products[0].id).toBe(outputCreateProduct1.id);
    expect(outputList.products[0].name).toBe(outputCreateProduct1.name);
    expect(outputList.products[0].price).toBe(outputCreateProduct1.price);
    expect(outputList.products[1].id).toBe(outputCreateProduct2.id);
    expect(outputList.products[1].name).toBe(outputCreateProduct2.name);
    expect(outputList.products[1].price).toBe(outputCreateProduct2.price);
  });
});
