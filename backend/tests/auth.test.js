const request = require("supertest");

describe("auth", () => {
  const userData = {
    username: "a",
    email: "a@a.com",
    provider: "local",
    password: "Password1",
    confirmed: true,
    blocked: null,
  };

  it("should login user and return jwt token", async (done) => {
    const userService = strapi.plugins["users-permissions"].services;
    await userService.user.add(userData);
    const response = await request(strapi.server)
      .post("/auth/local")
      .send({ identifier: "a@a.com", password: "Password1" })
      .expect(200);
    expect(response.body.jwt).toBeDefined();
    done();
  });

  it("should return users data for authenticated user", async (done) => {
    const userService = strapi.plugins["users-permissions"].services;
    const userRoleService = strapi.query("role", "users-permissions");
    const user = await userService.user.add({
      ...userData,
      role: (await userRoleService.findOne())?.id,
    });
    const jwt = userService.jwt.issue({ id: user.id });
    await request(strapi.server)
      .get("/users/me")
      .set("Authorization", `Bearer ${jwt}`)
      .then((data) => {
        expect(data.body).toBeDefined();
        expect(data.body.id).toBe(user.id);
        expect(data.body.username).toBe("a");
        expect(data.body.email).toBe("a@a.com");
      });
    done();
  });
});
