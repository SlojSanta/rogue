//Исходный массив
var map = []
//Массив сущностей: tileW => 0; tile => 0-3; tileE => 4; tileP => 5; tileHP => 6; tileSW => 7
var items = [{className: 'tileW', amount: 0, id: 0}, {className: 'tile', amount: getRandomNumber(5, 10), id: 1}, {className: 'tile', amount: getRandomNumber(3, 5), id: 2}, {className: 'tile', amount: getRandomNumber(3, 5), id: 3}, {className: 'tileE', amount: 10, id: 4}, {className: 'tileP', amount: 1, id: 5}, {className: 'tileHP', amount: 10, id: 6}, {className: 'tileSW', amount: 2, id: 7}]

var score = 0
var swordsDamage = 1
var counter = 0
var gameOver = false

backGenerateMap(map, 20, 40)

//==========>Блок генерации карты<==========//
//Генерация массива
function backGenerateMap (map, mapHeight, mapWidth) {
    var wIncludes = []
    for (var i = 0; i < mapHeight; i++) {
        var array = []
        for (var j = 0; j < mapWidth; j++) {
            var elementId = backGetElementId(mapWidth, i, j)
            var currentItem = 0
            var currentItemAdditional = 0

            if (wIncludes.includes(elementId)) {
                currentItem = 1
                if (j % 8 === 0 && i % 3 === 0) {
                    currentItemAdditional = backGetElementForGenerateMap(items[4].id, items[7].id, -1)
                }
            } 
            if (j % 9 === 0 && i === 0 && items[2].amount !== 0) {
                currentItem = backGetElementForGenerateMap(items[2].id, items[2].id, -1)
                wIncludes = (backPlanningWallForGenerateMap(wIncludes, mapWidth, i, j, mapHeight, 1))
            } else {
                
                if (i % 3 === 0 && j === 0 && items[3].amount !== 0) {
                    currentItem = backGetElementForGenerateMap(items[3].id, items[3].id, -1)
                    wIncludes = (backPlanningWallForGenerateMap(wIncludes, mapWidth, i, j, 1, mapWidth))
                } else {
                    if ((i + 1) % 6 === 0 && (j + 1) % 9 === 0 && items[1].amount !== 0) {
                        var wHeigth = getRandomNumber (3, 8)
                        var wWidth = getRandomNumber (3, 8)
                        currentItem = backGetElementForGenerateMap(items[1].id, items[1].id, -1)
                        wIncludes = (backPlanningWallForGenerateMap(wIncludes, mapWidth, i, j, wHeigth, wWidth))
                    }
                }
            }
            if (currentItem === items[2].id || currentItem === items[3].id) currentItem = 1
            array.push(currentItemAdditional? currentItemAdditional : currentItem)
            frontGenerateMap(currentItem, elementId, currentItemAdditional)
        }
        map.push(array)
    }
}

//Генерация HTML
function frontGenerateMap (item, itemId, itemAdditional) {
    var field = document.querySelector('.field')
    var div = document.createElement('div')
    var itemClassName = items[item].className
    var itemAdditionalClassName = items[itemAdditional].className
    var wallClassName = items[0].className
    
    div.classList.add(wallClassName)
    div.setAttribute('id', 'id' + itemId)

    if (item !== 0) {
        div.classList.add(itemClassName)
        if (itemAdditional !== 0) div.classList.add(itemAdditionalClassName)
    }
    field.append(div)

    if (item !== 0 && (itemAdditional === items[4].id || itemAdditional === items[5].id)) frontCreateHealth(div, '3px')
}

//Планирование "будущих" стен
function backPlanningWallForGenerateMap (array, arrayLength, i, j, wHeigth, wWidth) {
    for (var n = i; n < i + wHeigth; n++) {
        for (var m = j; m < j + wWidth; m++) {
           array.push(backGetElementId(arrayLength, n, m))
        }
    }
    return array
}

//Получение элемента массива сущностей в массив
function backGetElementForGenerateMap (min, max, back) {
    if (back === -1) {
        random = getRandomNumber(min, max)
        if (items[random].amount > 0) {
            items[random].amount--
            return random
        } else {
            var itemsSumAmount = 0
            for (var i = min; i <= max; i++) {
                itemsSumAmount += items[i].amount
            }
            if (itemsSumAmount !== 0) {
                backGetElementForGenerateMap (min, max, back)
                return random
            } else {
                return 0
            }
        }
    } else {
        return items[back].amount++
    }
}

//==========>Блок обновления карты<==========//
//Слушатель клавиатуры
document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowLeft' || event.code == 'ArrowRight' || event.code == 'ArrowUp' || event.code == 'ArrowDown' || event.code == 'Space') {
        if(!gameOver) {updateBoard(event.code)} else {}
    }
});

//Запуск обновления
function updateBoard(event) {
    if (event === 'ArrowLeft' ) updateMap(0, -1)
    if (event === 'ArrowRight') updateMap(0, 1)
    if (event === 'ArrowUp'   ) updateMap(-1, 0)
    if (event === 'ArrowDown' ) updateMap(1, 0)
    if (event === 'Space'     ) updateMap(0, 0)
}

//Запуск обновления
function updateMap (changeI, changeJ) {
    //backEnemyAtack(changeI, changeJ) => Easy mode - фиксирует атаку по противнику перед анимацией
    backMoveAction(map, changeI, changeJ, items[5].className)
    backMoveAction(map, changeI, changeJ, items[4].className)
    backAtack(changeI, changeJ)
}

//Обновление при ходьбе
function backMoveAction(array, changeI, changeJ, personOrEnemy) {
    var currentPersonId = findElementIdFromItemClassName(personOrEnemy)

    while (currentPersonId.length !== 0) {
        if (personOrEnemy === items[4].className) {
            var arrayChangeMove = getRandomMove()
            changeI = arrayChangeMove[0]
            changeJ = arrayChangeMove[1]
        }

        var newPersonId = currentPersonId[0] + changeI * array[0].length + changeJ
        var coordinates = findIndexMapFromId(array, currentPersonId[0])
        var pickSW = false
        var pickHP = false
        var i = coordinates[0]
        var j = coordinates[1]

        try {
            if (array[i + changeI][j + changeJ] === undefined || array[i + changeI][j + changeJ] === items[0].id || array[i + changeI][j + changeJ] === items[4].id || array[i + changeI][j + changeJ] === items[5].id) {
                currentPersonId.shift()
            } else {
                if (array[i + changeI][j + changeJ] === items[6].id) { 
                    array[i + changeI][j + changeJ] = items[1].id 
                    pickHP = true
                }
                if (array[i + changeI][j + changeJ] === items[7].id) {
                    array[i + changeI][j + changeJ] = items[1].id
                    pickSW = true
                }

                var currentItem = array[i][j]
            
                array[i][j] = array[i + changeI][j + changeJ]
                array[i + changeI][j + changeJ] = currentItem

                frontMoveAction(currentPersonId[0], newPersonId, personOrEnemy, pickHP, pickSW)

                currentPersonId.shift()
            }
        } catch { currentPersonId.shift() }
    }
}

//Обновление при атаке или долгом стоянии рядом с противником
function backAtack (changeI, changeJ) {
    var calculateNearPersonAndEnemy = [0, 0, 0]
    calculateNearPersonAndEnemy = backCalculateNearPersonAndEnemy()
    var enemyId = calculateNearPersonAndEnemy[0]
    
    if (changeI === 0 && changeJ === 0 && calculateNearPersonAndEnemy[0] !== 0) {
        var enemyItem = document.querySelector('#id' + enemyId)
        var enemyItemHealth = enemyItem.querySelector('.health')
        var enemyItemHealthHeight = enemyItemHealth.style.height 
        enemyItemHealth.parentNode.removeChild(enemyItemHealth)
        frontCreateHealth(enemyItem, (parseStringToInt(enemyItemHealthHeight) - swordsDamage) + 'px')

        if ((parseStringToInt(enemyItemHealthHeight) - swordsDamage) <= 0) {
            frontRemoveItemClassName (enemyId, items[4].className)
            frontRemoveItemChildForUpdateMap (enemyId, 'health', 1, 1)
            frontChangeScore ('score', score++)
            map[calculateNearPersonAndEnemy[1]][calculateNearPersonAndEnemy[2]] = 1
        }
    } else {
        if (counter >= 2) {
            var personItem = document.querySelector('.' + items[5].className)
            var personItemHealth = personItem.querySelector('.health')
            var personItemHealthHeight = personItemHealth.style.height 
            personItemHealth.parentNode.removeChild(personItemHealth)
            frontCreateHealth(personItem, (parseStringToInt(personItemHealthHeight) - 1) + 'px')
    
            if ((parseStringToInt(personItemHealthHeight) - 1) === 0) {
                gameOver = true
                frontChangeScore('score', score + ' - Click to start new game')
                h1 = document.querySelector('.score')
                h1.style.cursor = 'pointer'
                h1.addEventListener('click', function () {location.reload()})
            }
        }
    }
}

//==========>Блок используемых функций<==========//
//Обновление анимации
function frontMoveAction (currentId, newId, className, pickHP, pickSW) {
    frontAddItemForUpdateMap (newId, className, pickHP, pickSW, currentId)
    frontRemoveItemChildForUpdateMap (currentId, className, pickHP, pickSW)
}

//Создание сущностей
function frontAddItemForUpdateMap (newId, className, pickHP, pickSW, currentId) {
    var newItem = document.querySelector('#id' + newId)
    var currentItem = document.querySelector('#id' + currentId)
    var healthItem = currentItem.querySelector('.health')
    var healthHeight = healthItem.style.height

    newItem.classList.add(className)

    if (className === items[5].className) {
        var divHelth = createElementAddclasslistAddstyleheigth('div', 'health', healthHeight)

        if (pickHP) {
            if ((parseStringToInt(divHelth.style.height)) < 3) divHelth.style.height = (parseStringToInt(healthHeight) + 1) + 'px'
            frontRemoveItemClassName(newId, items[6].className)
        }
        newItem.appendChild(divHelth)
    }

    if (className === items[4].className) {
        var divHelth = createElementAddclasslistAddstyleheigth('div', 'health', healthHeight)

        if (pickHP) frontRemoveItemClassName(newId, items[6].className)

        newItem.appendChild(divHelth)
    }

    if (pickSW) {
        frontRemoveItemClassName(newId, items[7].className)
        if (className === items[5].className) {
        swordsDamage++
        frontCreateItem('inventory', 'div', 'inventoryItems')
        }
    }
} 

//Удаление сущностей
function frontRemoveItemChildForUpdateMap (currentId, className, pickHP, pickSW) {
    var currentItem = document.querySelector('#id' + currentId)
    currentItem?.classList.remove(className)
    currentItem.removeChild(currentItem.firstChild)
}

//Нахождение врагов рядом с персонажем
function backCalculateNearPersonAndEnemy () {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            if (map[i][j] == items[5].id) {
                try { if (map[i][j - 1] === items[4].id) {
                    counter++
                    return [backGetElementId(map[0].length, i, j - 1), i, j - 1]
                } } catch {}
                try { if (map[i][j + 1] === items[4].id) {
                    counter++
                    return [backGetElementId(map[0].length, i, j + 1), i, j + 1]
                } } catch {}
                try { if (map[i - 1][j] === items[4].id) {
                    counter++
                    return [backGetElementId(map[0].length, i - 1, j), i - 1, j]
                } } catch {}
                try { if (map[i + 1][j] === items[4].id) {
                    counter++
                    return [backGetElementId(map[0].length, i + 1, j), i + 1, j]
                } } catch {}
                counter = 0
                return [0, 0, 0]
            }
        }
    }
}

//==========>Блок вспомогательных функций<==========//
//Найти id элемента по его названию класса (HTML)
function findElementIdFromItemClassName (className) {
    var arrayOfElementId = []
    if (className === items[5].className) {
        arrayOfElementId.push(parseStringToInt(document.querySelector('.' + className).getAttribute('id')))
        return arrayOfElementId
    } else {
        document.querySelectorAll('.' + className).forEach((e) => arrayOfElementId.push(parseStringToInt(e.getAttribute('id'))))
        return arrayOfElementId
    }
}

//Создать элемент (HTML)
function frontCreateItem (className = 0, parameterCreateElement = 0, parameterAddClassList = 0, parameterAddstyle = 0) {
    var item = document.querySelector('.' + className)
    var div = createElementAddclasslistAddstyleheigth(parameterCreateElement, parameterAddClassList, parameterAddstyle)
    item.append(div)
}

//Удалить элемент по его названию класса (HTML)
function frontRemoveItemClassName (id, className) {
    var item = document.querySelector('#id' + id)
    item?.classList.remove(className)
}

//Создает полоску здоровья (HTML)
function frontCreateHealth(div, height_px) {
    var divHealth = createElementAddclasslistAddstyleheigth('div', 'health', height_px)
    div.appendChild(divHealth)
}

//Изменить Score (HTML)
function frontChangeScore (className, score) {
    if (typeof score === 'number') score++
    console.log(typeof score);
    var item = document.querySelector('.' + className)
    item.innerHTML = 'Score: ' + score
}

//Создает уникальные id по координатам массива
function backGetElementId (arrayLength, i, j) {
    return (arrayLength - 1) * i + j + i
}

//Создает пару координат массива по id
function findIndexMapFromId (array, elementId) {
    var i = Math.floor(elementId / array[0].length)
    var j = elementId - i * array[0].length
    return [i, j]
}

//Случайное движение для врагов
function getRandomMove () {
    var i = getRandomNumber(-1, 1)
    var j = 0
    if (i === 0) {
        j = getRandomNumber(-1, 1)
    }
    return [i, j]
}

//==========>Блок прочих функций<==========//
//Конструктор: создание элемента => добавление класса => Изменение высоты в стиле
function createElementAddclasslistAddstyleheigth (parameterCreateElement = 0, parameterAddClassList = 0, parameterAddstyle = 0) {
    if (parameterCreateElement) var item = document.createElement(parameterCreateElement)
    if (parameterAddClassList) item.classList.add(parameterAddClassList)
    if (parameterAddstyle) item.style.height = parameterAddstyle
    return item
}

//Из строки в число, оставляя только цифры
function parseStringToInt (string) {
    return parseInt(string.match(/\d+/))
}

//Случайное число в диапазоне
function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}