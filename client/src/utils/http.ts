export const postData = async (url: string, data: any) => {
  let payload: any = {};
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    payload = await response.json();

    if (!!payload["error"] || response.status >= 400) {
      throw { ...payload["error"], status: response.status };
    }

    return payload;
  } catch (error) {
    console.error(error);
  }
};
