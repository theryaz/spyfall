"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = [
    'blue',
    'crimson',
    'green',
    'purple',
];
const icons = [
    'fa-dog',
    'fa-user-astronaut',
    'fa-user-alien',
    'fa-head-side',
    'fa-user-cowboy',
    'fa-user-crown',
    'fa-user-graduate',
    'fa-user-hard-hat',
    'fa-user-md',
    'fa-user-ninja',
    'fa-user-visor',
];
exports.Avatars = {
    colors,
    icons,
    randomColor: () => {
        return colors[~~(Math.random() * colors.length)];
    },
    randomIcon: () => {
        return icons[~~(Math.random() * icons.length)];
    },
};
