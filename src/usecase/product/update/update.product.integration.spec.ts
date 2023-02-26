import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

const product = {
    id: 1,
    name: "Product",
    price: 30
}

const input = {
  id: 1,
  name: "Product Updated",
  price: 60,
};

describe("Integration test for product update use case", () => {
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
  it("should update a customer", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const outputCreate = await productCreateUseCase.execute(product);

    const outputUpdate = await productUpdateUseCase.execute(outputCreate);

    expect(outputUpdate).toEqual(outputCreate);
  });
});
