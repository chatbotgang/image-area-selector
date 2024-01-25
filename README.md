# Image Area Selector

## Instructions

This repository contains a simple project initialized with [Vite template](https://vitejs.dev/guide/#scaffolding-your-first-vite-project). Please use this as the foundation for developing an application that meets the design specifications and technical expectations below. The whole process should take no more than 3 to 6 hours.

## Design Specifications

Figure 1:

<img src="./src/assets/q1.jpg" />

Figure 2:

<img src="./src/assets/q2.jpg" />

1. Implement a single-page React application that allows the user to upload an image of unlimited size from their local system. It should follow the design specifications described in Figure 1.
2. The uploaded picture should be displayed in the interactive image preview pane on the left side of the screen (see Figure 2). The picture should be scaled to a width of 355 px, and the height should be constrained by the original aspect ratio of the picture.
3. The user should be able to select any number of rectangular areas in the image preview pane, and the coordinates of the selected area _relative to the rendered size of the image itself_ should be displayed in a readable, indented, non-interactive format in the data preview pane (Figure 2, right).
4. The user should be able to delete each selection block using a hovering icon button similar to what is displayed in the sample image.
5. The user should be able to arbitrarily reposition and resize each selection block without exceeding the dimensions of the image preview.
6. The data preview panel should be updated with selection block coordinates after every addition, deletion, resizing, or repositioning.
7. Ensure each selection block cannot overlay another selection block.

Note: emulating the look and feel of the sample images is encouraged but the more important part is completing the functionality described above.

## Technical Expectations

- Use TypeScript, React hooks, and functional components to develop the application.
- Using third party packages installed with `pnpm` is welcome; you aren't required to (and probably shouldn't) write everything from scratch, but we may ask about why you chose a particular approach.
- For CSS-in-JS we suggest (but do not require) using [Emotion](https://emotion.sh/docs/introduction).
- Clean and readable code style is encouraged!

## Git Workflow

- Please fork the `develop` branch to work on the application.
- When the application is ready for review open a pull request to `develop` branch using the template provided.
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) style to name your branch, commit(s), and pull request.
- Team members may leave some comments on your PR as code review; feel welcome to respond and interact there, or send a private message if you prefer.

If you have any questions about the assignment or the process, you are welcome to send an email and ask. Thank you for taking the time to complete this application, and good luck!

## Implement Summary
1. I had finished image upload component, and try to make a multipule rectangles selector.
2. As a senior front-end Engineer, I fully understand the redux & redux-toolkit will be better way to manager our state. On the other hand, I would let you know how deep I have learn form React library. There's my education blogs which had been  attended IThome ironman competition. [->link](https://ithelp.ithome.com.tw/users/20129020/ironman/5360) If you want to know how I implement store please checked out [my Medium's article.](https://medium.com/@LeeLuciano/react-%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B-context-provider-6c2cb3603fc9)
3. I choice vanilla way to Implement our project. There's dilemma when I deal with the resizing proccess. I couldn't find out a solution which can do mouse move event accurately like the third party library that's called react-image-corp.
4. Please ignore the react_corp path, I install it as reference when I was developing.
5. I had finished image upload & add rectangle selector area on the preview area, also print those rectangle areas data that you drew. 
