import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { access } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  const uploadDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadDir, filename);

  try {
    // Verificar si el directorio de uploads existe
    await access(uploadDir);
  } catch (error) {
    console.error("El directorio de uploads no existe:", error);
    return NextResponse.json(
      { error: "El directorio de uploads no existe" },
      { status: 500 }
    );
  }

  try {
    // Verificar si el archivo existe
    await access(filePath);
  } catch (error) {
    console.error("El archivo no existe:", error);
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }

  try {
    const stat = statSync(filePath);
    const fileSize = stat.size;
    const fileStream = createReadStream(filePath);

    // Configurar los headers para la respuesta de transmisión
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Length", fileSize.toString());

    // Crear y devolver un ReadableStream
    return new NextResponse(
      new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (error) => controller.error(error));
        },
      }),
      { headers }
    );
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return NextResponse.json(
      { error: "Error al leer el archivo" },
      { status: 500 }
    );
  }
}
