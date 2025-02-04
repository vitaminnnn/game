export const clearBoard = (context: CanvasRenderingContext2D | null) => {
  if (context) {
    context.clearRect(0, 0, 1000, 600);
  }
};

export interface IObjectBody {
  x: number;
  y: number;
}

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  strokeStyle = "#146356"
) => {
  if (context) {
    objectBody.forEach((object: IObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context?.fillRect(object.x, object.y, 20, 20);
      context?.strokeRect(object.x, object.y, 20, 20);
    });
  }
};

function randomNumber(min: number, max: number) {
  let random = Math.random() * max;
  return random - (random % 20);
}
export const generateRandomPosition = (width: number, height: number) => {
  return {
    x: randomNumber(0, width),
    y: randomNumber(0, height),
  };
};

export const hasSnakeCollided = (
  snake: IObjectBody[],
  currentHeadPos: IObjectBody
) => {
  let flag = false;
  snake.forEach((pos: IObjectBody, index: number) => {
    if (
      pos.x === currentHeadPos.x &&
      pos.y === currentHeadPos.y &&
      index !== 0
    ) {
      flag = true;
    }
  });

  return flag;
};


export const drawSnake = (context: CanvasRenderingContext2D, snake: IObjectBody[], color: string) => {
  snake.forEach((segment) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.stroke();
  });
};

export const drawFruit = (context: CanvasRenderingContext2D, fruit: IObjectBody[]) => {
  fruit.forEach((item) => {
    context.fillStyle = "#f30202";
    context.beginPath();
    context.arc(item.x + 10, item.y + 10, 10 + Math.sin(Date.now() / 100) * 2, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.stroke();
  });
};

export const drawScore = (context: CanvasRenderingContext2D, score: number) => {
  context.font = "20px Arial";
  context.fillStyle = "#000000";
  context.fillText(`Score: ${score}`, 10, 30);
};
