import supertest, { SuperTest, Test, Response } from "supertest";
import { routes } from "../src/routes/route";
import { invalidId, nonExistentUserId, updatedUser, url, user } from "./const";
import { StatusCode, errorMessages } from "../src/utils/const";

let request: SuperTest<Test>;
let expectHeaders: (response: supertest.Response) => void;
let createUser: () => Promise<Response>;
beforeAll(() => {
  request = supertest(routes);
  expectHeaders = (response: Response) =>
    expect(response.headers["content-type"]).toEqual(expect.stringContaining("application/json"));

  createUser = async () => {
    return await request.post(url).send(user);
  };
});

describe("1. Get all records with a GET api/users request (an empty array is expected)", () => {
  it("Empty array is expected and Content-Type is application/json", async () => {
    const response = await request.get(url);
    expect(response.statusCode).toBe(StatusCode.ok);
    expectHeaders(response);
    expect(response.body).toEqual([]);
  });

  it("Expect create user", async () => {
    const response = await createUser();
    expectHeaders(response);
    expect(response.statusCode).toBe(StatusCode.created);
    expect(response.body.id).not.toEqual("");
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.username).toEqual(user.username);
    expect(response.body.age).toEqual(user.age);
    expect(response.body.hobbies).toEqual(user.hobbies);
  });

  it("Get user", async () => {
    const createUserResponse = await createUser();
    const id = createUserResponse.body.id;
    const response = await request.get(`${url}/${id}`);
    expectHeaders(response);
    expect(response.statusCode).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id,
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
    });
  });

  it("should update the user's username and hobbies successfully", async () => {
    const createUserResponse = await createUser();
    const id = createUserResponse.body.id;
    const response = await request.put(`${url}/${id}`).send(updatedUser);
    expectHeaders(response);
    expect(response.statusCode).toBe(StatusCode.ok);
    expect(response.body).toEqual(updatedUser);
  });

  it("delete the user", async () => {
    const createUserResponse = await createUser();
    const id = createUserResponse.body.id;
    const response = await request.delete(`${url}/${id}`);
    expectHeaders(response);
    expect(response.statusCode).toBe(StatusCode.noContent);
    expect(response.body).toEqual("");
  });

  it("Try find deleted the user", async () => {
    const createUserResponse = await createUser();
    const id = createUserResponse.body.id;
    const responseDeleted = await request.delete(`${url}/${id}`);
    expectHeaders(responseDeleted);
    expect(responseDeleted.statusCode).toBe(StatusCode.noContent);
    expect(responseDeleted.body).toEqual("");

    const response = await request.get(`${url}/${id}`);
    expect(response.statusCode).toBe(StatusCode.notFound);
    expect(response.body).toEqual({ message: errorMessages.userNotFound });
  });
});

describe("2. Check error messages", () => {
  it("Should return an error for invalid UUIDv4", async () => {
    await createUser();
    const response = await request.get(`${url}/${invalidId}`);

    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.invalidUserId);
  });

  it("should indicate user not found for an undefined user", async () => {
    await createUser();
    const nonExistentUserId = "e32e8b92-acce-40ba-a4a9-6ed8baaee5f8";
    const response = await request.get(`${url}/${nonExistentUserId}`);
    expect(response.statusCode).toBe(StatusCode.notFound);
    expect(response.body.message).toEqual(errorMessages.userNotFound);
  });

  it("change user not found for an undefined user", async () => {
    await createUser();
    const response = await request.put(`${url}/${nonExistentUserId}`).send(updatedUser);
    expect(response.statusCode).toBe(StatusCode.notFound);
    expect(response.body.message).toEqual(errorMessages.userNotFound);
  });

  it("change user with invalid UUIDv4", async () => {
    await createUser();
    const response = await request.put(`${url}/${invalidId}`).send(updatedUser);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.invalidUserId);
  });

  it("delete user not found for an undefined user", async () => {
    await createUser();
    const response = await request.delete(`${url}/${nonExistentUserId}`);
    expect(response.statusCode).toBe(StatusCode.notFound);
    expect(response.body.message).toEqual(errorMessages.userNotFound);
  });

  it("delete user with invalid UUIDv4", async () => {
    await createUser();
    const response = await request.put(`${url}/${invalidId}`);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.invalidUserId);
  });
});


describe('3. Check users object fields', () => {
  it('Check name field', async () => {
    const userIncludeName = {
      age: 35,
      hobbies: ["playTheGuitar", "badminton"],
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
  it('Check age field', async () => {
    const userIncludeName = {
      username: "Vladislav",
      hobbies: ["playTheGuitar", "badminton"],
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
  it('Check hobbies field', async () => {
    const userIncludeName = {
      username: "Vladislav",
      age: 35,
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
  it('Check data type of name field', async () => {
    const userIncludeName = {
      username: true,
      age: 35,
      hobbies: ["playTheGuitar", "badminton"],
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
  it('Check data type of age field', async () => {
    const userIncludeName = {
      username: true,
      age: '35',
      hobbies: ["playTheGuitar", "badminton"],
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
  it('Check data type of hobbies field', async () => {
    const userIncludeName = {
      username: true,
      age: '35',
      hobbies: ["playTheGuitar", undefined],
    }
    const response = await request.post(url).send(userIncludeName);
    expect(response.statusCode).toBe(StatusCode.badRequest);
    expect(response.body.message).toEqual(errorMessages.missingFields);
  })
})