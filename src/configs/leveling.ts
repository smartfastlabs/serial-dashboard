export const LevelingConfig = {
  variables: {},
  root: {
    type: "container",
    class: "container w-100",
    items: [
      {
        type: "chart",
        name: "Leg Position",
        class: "col",
        dataSets: [
          {
            name: "Left Front",
            key: "84-position-1",
          },
          {
            name: "Left Back",
            key: "84-position-2",
          },
          {
            name: "Right Front",
            key: "C8-position-1",
          },
          {
            name: "Right Back",
            key: "C8-position-2",
          },
        ],
      },
      {
        type: "container",
        class: "row",
        items: [
          {
            type: "button",
            class: "col",
            name: "UP",
            onMouseDown: "0:3:200",
            onMouseUp: "0:0:0",
          },
          {
            type: "button",
            class: "col",
            name: "DOWN",
            onMouseDown: "0:3:-200",
            onMouseUp: "0:0:0",
          },
          {
            type: "button",
            class: "col",
            name: "STOP",
            onMouseClick: "0:0:0",
          },
        ],
      },
      {
        type: "container",
        class: "row",
        items: [
          {
            type: "metric",
            class: "col",
            name: "Mode",
            key: "mode",
          },
          {
            type: "metric",
            class: "col",
            name: "Left Front",
            key: "84-position-1",
          },
          {
            type: "metric",
            class: "col",
            name: "Left Back",
            key: "84-position-2",
          },
          {
            type: "metric",
            class: "col",
            name: "Right Front",
            key: "C8-position-1",
          },
          {
            type: "metric",
            class: "col",
            name: "Right Back",
            key: "C8-position-2",
          },
        ],
      },
      {
        type: "chart",
        name: "Bounds",
        hidden: true,
        class: "col",
        dataSets: [
          {
            name: "Left Front Min",
            key: "84-min-1",
          },
          {
            name: "Left Back Max",
            key: "84-max-1",
          },
          {
            name: "Left Front Min",
            key: "84-min-2",
          },
          {
            name: "Left Back Max",
            key: "84-max-2",
          },
          {
            name: "Right Front Min",
            key: "C8-min-1",
          },
          {
            name: "Right Back Max",
            key: "C8-max-1",
          },
          {
            name: "Right Front Min",
            key: "C8-min-2",
          },
          {
            name: "Right Back Max",
            key: "C8-max-2",
          },
          {
            name: "Right Bounds Enabled",
            key: "C8-bounds-enabled",
          },
          {
            name: "Left Bounds Enabled",
            key: "84-bounds-enabled",
          },
        ],
      },
      {
        type: "container",
        class: "row",
        items: [
          {
            type: "button",
            class: "col",
            name: "ENABLE BOUNDS",
            onMouseDown: "0:13:0",
          },
          {
            type: "button",
            class: "col",
            name: "DISABLE BOUNDS",
            onMouseDown: "0:12:0",
          },
        ],
      },
      {
        type: "container",
        class: "row",
        items: [
          {
            type: "button",
            class: "col",
            name: "SET ZERO",
            onMouseDown: "0:8:0",
          },
          {
            type: "button",
            class: "col",
            name: "SET MIN",
            onMouseDown: "0:9:0",
          },
          {
            type: "button",
            class: "col",
            name: "SET MAX",
            onMouseDown: "0:10:0",
          },
        ],
      },
      {
        type: "chart",
        hidden: true,
        name: "Encoder Offset",
        class: "col",
        dataSets: [
          {
            name: "Left Front",
            key: "84-offset-1",
          },
          {
            name: "Left Front",
            key: "84-offset-2",
          },
          {
            name: "Right Front",
            key: "C8-offset-1",
          },
          {
            name: "Right Back",
            key: "C8-offset-2",
          },
        ],
      },
      {
        type: "container",
        class: "row",
        items: [
          {
            type: "container",
            class: "col",
            items: [
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Both",
                    class: "col",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "UP",
                    onMouseDown: "1:3:200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    class: "col",
                    type: "button",
                    name: "DOWN",
                    onMouseDown: "1:3:-200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    class: "col",
                    type: "button",
                    name: "STOP",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Front",
                    class: "col",
                  },
                  {
                    type: "button",
                    name: "UP",
                    onMouseDown: "1:4:200",
                    onMouseUp: "0:0:0",
                    class: "col btn btn-danger",
                  },
                  {
                    type: "button",
                    name: "DOWN",
                    onMouseDown: "1:4:-200",
                    onMouseUp: "0:0:0",
                    class: "col",
                  },
                  {
                    type: "button",
                    name: "STOP",
                    class: "col",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Back",
                    class: "col",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "UP",
                    onMouseDown: "1:5:200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "DOWN",
                    onMouseDown: "1:5:-200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "STOP",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
            ],
          },
          {
            type: "container",
            class: "col",
            items: [
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Both",
                    class: "col",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "UP",
                    onMouseDown: "2:3:200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "DOWN",
                    onMouseDown: "2:3:-200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "STOP",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Front",
                    class: "col",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "UP",
                    onMouseDown: "2:4:200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "DOWN",
                    onMouseDown: "2:4:-200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "STOP",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
              {
                type: "container",
                class: "row",
                items: [
                  {
                    name: "Back",
                    class: "col",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "UP",
                    onMouseDown: "2:5:200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "DOWN",
                    onMouseDown: "2:5:-200",
                    onMouseUp: "0:0:0",
                  },
                  {
                    type: "button",
                    class: "col",
                    name: "STOP",
                    onMouseClick: "0:0:0",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
