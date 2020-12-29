import { getYouTubeChannelId } from "./youtube";

describe("getYouTubeChannelId", () => {
  test("defaults", async () => {
    const gycid = (path) =>
      getYouTubeChannelId("https://www.youtube.com/" + path);
    expect(await gycid("channel/UCIE4SeH_UJBNKqZvxkNFBDw")).toBe(
      "UCIE4SeH_UJBNKqZvxkNFBDw"
    );
    expect(await gycid("c/TrueLittleMonk")).toBe("UCGLC-euAIB3gHdPkTWNfg8g");
    expect(await gycid("user/AjahnSona")).toBe("UCCRXOn6Tsrgm9gJR4z3qLZA");
    expect(await gycid("PacificHermitage")).toBe("UCXQFa-qxHE26J_B5i22HCwA");
    expect(await gycid("TrueLittleMonk")).toBe("UCGLC-euAIB3gHdPkTWNfg8g");
  });

  test("local only", async () => {
    const local = (path) =>
      getYouTubeChannelId("https://www.youtube.com/" + path, {
        api: false,
        web: false,
      });
    expect(await local("channel/UCIE4SeH_UJBNKqZvxkNFBDw")).toBe(
      "UCIE4SeH_UJBNKqZvxkNFBDw"
    );
    expect(await local("c/TrueLittleMonk")).toBe(false);
    expect(await local("user/AjahnSona")).toBe(false);
    expect(await local("PacificHermitage")).toBe(false);
  });

  test("api only", async () => {
    const api = (path) =>
      getYouTubeChannelId("https://www.youtube.com/" + path, {
        api: true,
        web: false,
      });
    expect(await api("channel/UCIE4SeH_UJBNKqZvxkNFBDw")).toBe(
      "UCIE4SeH_UJBNKqZvxkNFBDw"
    );
    expect(await api("c/TrueLittleMonk")).toBe("UC6RmHSIXCpKdiJvhWDyBy7g");
    expect(await api("user/AjahnSona")).toBe("UCCRXOn6Tsrgm9gJR4z3qLZA");
    expect(await api("PacificHermitage")).toBe(false);
  });

  test("web only", async () => {
    const web = (path) =>
      getYouTubeChannelId("https://www.youtube.com/" + path, {
        api: false,
        web: true,
      });
    expect(await web("channel/UCIE4SeH_UJBNKqZvxkNFBDw")).toBe(
      "UCIE4SeH_UJBNKqZvxkNFBDw"
    );
    expect(await web("c/TrueLittleMonk")).toBe("UCGLC-euAIB3gHdPkTWNfg8g");
    expect(await web("user/AjahnSona")).toBe("UCCRXOn6Tsrgm9gJR4z3qLZA");
    expect(await web("PacificHermitage")).toBe("UCXQFa-qxHE26J_B5i22HCwA");
  });
});
