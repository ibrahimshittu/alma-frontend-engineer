import jwt from "jsonwebtoken";

export function verifyAuthToken(request: Request): void {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: kindly login to access this resource");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "";
  try {
    jwt.verify(token, secret);
  } catch (error) {
    throw new Error(
      `Unauthorized: Invalid credentials - ${(error as Error).message}`
    );
  }
}
