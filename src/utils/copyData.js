export default function copyData(data, toast) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(data.toString())
      .then(() => {
        toast("Lien copié dans le presse-papier !");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  }
}
