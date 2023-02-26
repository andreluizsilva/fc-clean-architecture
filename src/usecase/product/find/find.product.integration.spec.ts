import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "./find.product.usecase";

const product = {
    id: "123", 
    name: "Product 1", 
    price: 30
}

describe("Unit test find product use case", () => {
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
    it("should find a product", async() => {
        const productRepository = new ProductRepository();
        const createUseCase = new CreateProductUseCase(productRepository);
        const findUseCase = new FindProductUseCase(productRepository);

        const input = await createUseCase.execute(product);

        const output = {
            id: expect.any(String),
            name: "Product 1",
            price: 30
        }

        const result = await findUseCase.execute(input);
        expect(result).toEqual(output);
    });

    it("should not find a product", async() => {
        const productRepository = new ProductRepository();       
        const usecase = new FindProductUseCase(productRepository);

        const input = {
        id: "123",
        };

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    })
  })