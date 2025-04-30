function buildImageCarousel(projectName, imageSources) {
  const templateCarousel = `<div id="kadoinimage" class="carousel slide" data-auto="true" data-interval="5" data-order="next"><div class="carousel-indicators">
  {{image_buttons}}</div><div class="carousel-inner">{{images}}</div><button class="carousel-control-prev" type="button">
  <i class="carousel-control-prev-icon" aria-hidden="true"></i></button><button class="carousel-control-next" type="button">
  <i class="carousel-control-next-icon" aria-hidden="true"></i></button></div>`;
  const templateImageButton = `<button type="button" {{image_button_state}} data-slide-to="{{image_index}}"
   aria-label="{{image_label}}"></button>`;
  const templateImageHtml = `<div class="carousel-item {{image_state}}"><img src="{{image_src}}" alt="{{image_label}}"/></div>`;

  let imageHtmls = "";
  let imageButtons = "";
  if (isValid(imageSources)) {
    if (imageSources.length > 1) {
      const imageId =
        projectName.replace(" ", "").toLocaleLowerCase() + "image";

      imageSources.forEach((source, index) => {
        const imageLabel = `${projectName} Image ${index + 1}`;

        const imageButton = templateImageButton
          .replace("{{image_index}}", index)
          .replace("{{image_label}}", imageLabel)
          .replace(
            "{{image_button_state}}",
            index === 0 ? 'class="active" aria-current="true"' : ""
          );
        imageButtons += imageButton;

        const imageHtml = templateImageHtml
          .replace("{{image_src}}", source)
          .replace("{{image_label}}", imageLabel)
          .replace("{{image_state}}", index === 0 ? "active" : "");
        imageHtmls += imageHtml;
      });

      return templateCarousel
        .replace("{{image_buttons}}", imageButtons)
        .replace("{{images}}", imageHtmls)
        .replaceAll("{{image_id}}", imageId);
    } else {
      return `<img src="${imageSources[0]}" alt="${projectName} Image"/>`;
    }
  } else {
    return `<img src="https://fakeimg.pl/600x300/f7f7f7/?text=${projectName}" alt="${projectName} Image"/>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sectionProject = document.getElementById("project");
  const dataProject = JSON.parse(sectionProject.dataset.projects);
  const dataProjectHTMLList = [];
  const article = sectionProject.querySelector("article");
  const parentArticle = article.parentElement;
  const templateArticle = article.outerHTML;

  dataProject.projects.forEach((project) => {
    let otherHtml = "";
    if (isValid(project.demo)) {
      otherHtml += `<i class="bi bi-browser-chrome"></i>&nbsp;<a href="${project.demo}" target="_blank">Demo</a>`;
    }

    if (isValid(project.github)) {
      otherHtml += ` <i class="bi bi-github"></i>&nbsp;<a href="${project.github}" target="_blank">GitHub</a>`;
    } else {
      otherHtml += ' <i class="bi bi-github"></i>&nbsp;Closed Source';
    }

    const imageHtml = buildImageCarousel(project.title, project.images);

    const copyArticle = templateArticle
      .replace("{{title}}", project.title)
      .replace("{{description}}", project.description)
      .replace("{{techstack}}", project.techstack.join(", "))
      .replace("{{other}}", otherHtml)
      .replace("{{images}}", imageHtml);

    dataProjectHTMLList.push(copyArticle);
  });

  parentArticle.innerHTML = dataProjectHTMLList.join("");
});
