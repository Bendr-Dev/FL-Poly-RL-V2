export const postData = async (url: string, data: any) => {
  let payload: any = {};
  let error = null;
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
      error = { ...payload["error"], status: response.status };
    }

    return [error, payload];
  } catch (error) {
    throw error;
  }
};

export const getData = async (url: string) => {
  let payload: any = {};
  let error: any = null;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    payload = await response.json();

    if (!!payload["error"] || response.status >= 400) {
      error = { ...payload["error"], status: response.status };
    }

    return [error, payload];
  } catch (error) {
    throw error;
  }
};
