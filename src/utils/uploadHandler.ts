const backendUrl: string = import.meta.env.VITE_BACKEND_URL || '';

export async function uploadFiles(files: FileList): Promise<void> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    const response = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'combined.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('Error al combinar los archivos.');
    }
  } catch (error) {
    console.error('Error al subir los archivos:', error);
    alert('Error al conectar con el servidor.');
  }
}
