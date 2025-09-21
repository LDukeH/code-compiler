const API_KEY = process.env.NEXT_PUBLIC_JUDGE_API_KEY;

export async function postSubmission(code: string, languageId: number) {
  const url =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": API_KEY!,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: languageId,
      source_code: code,
      stdin: "",
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getSubmissionStatus(code: string, languageId: number) {
  const submissionToken = await postSubmission(code, languageId);
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken.token}?base64_encoded=false&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY!,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
