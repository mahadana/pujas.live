import axios from "axios";

(async () => {
  const result1 = await axios.post("http://backend:1337/auth/local", {
    identifier: "a@a.com",
    password: "Password1",
  });

  console.log(result1.data.jwt);

  const result2 = await axios.get("http://backend:1337/monasteries", {
    headers: {
      Authorization: `Bearer ${result1.data.jwt}`,
    },
  });

  console.log(result2.data);
})();
