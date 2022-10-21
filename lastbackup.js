//Исходный массив
var map = []
//Массив сущностей
var items = [{className: 'tileW', amount: 0, id: 0}, {className: 'tile', amount: getRandomNumber(5, 10), id: 1}, {className: 'tile', amount: getRandomNumber(3, 5), id: 2}, {className: 'tile', amount: getRandomNumber(3, 5), id: 3}, {className: 'tileE', amount: 10, id: 4}, {className: 'tileP', amount: 1, id: 5}, {className: 'tileHP', amount: 10, id: 6}, {className: 'tileSW', amount: 2, id: 7}]

var score = 0
var counter = 0
var gameOver = false

var gameWindowWidth = Math.floor(document.documentElement.clientWidth / 40 / 10) * 10
var gameWindowHeight = Math.floor(document.documentElement.clientHeight / 40 / 10) * 10
var swordsDamage = 1
//var pHealth = 3
//var eHealth = 3
//items[0].amount = gameWindowWidth * gameWindowHeight + items[1].amount + items[2].amount + items[3].amount + items[4].amount + items[5].amount

backGenerateMap(map, 20, 40)
console.log(items);
function backGenerateMap (map, mapHeight, mapWidth) {
    var wIncludes = []
    for (var i = 0; i < mapHeight; i++) {
        var array = []
        for (var j = 0; j < mapWidth; j++) {
            var elementId = backGetElementIdForGenerateMap(mapWidth, i, j)
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
            if (currentItem === items[2].id || currentItem === items[3].id) {
                currentItem = 1
            }
            array.push(currentItemAdditional? currentItemAdditional : currentItem)
            frontGenerateMap(currentItem, elementId, currentItemAdditional)
        }
        map.push(array)
    }
    //console.log(array);
    console.log(wIncludes);
}

console.log(map);

function backPlanningWallForGenerateMap (array, arrayLength, i, j, wHeigth, wWidth) {
    console.log(`размер: ${arrayLength}, i: ${i}, j: ${j}, высота: ${wHeigth}, ширина: ${wWidth}`);
    for (var n = i; n < i + wHeigth; n++) {
        for (var m = j; m < j + wWidth; m++) {
           array.push(backGetElementIdForGenerateMap(arrayLength, n, m))
        }
    }
    return array
}

function backGetElementIdForGenerateMap (arrayLength, i, j) {
    return (arrayLength - 1) * i + j + i
}

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

function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

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
        if (itemAdditional !== 0) {
            div.classList.add(itemAdditionalClassName)

            
        }
    }
    field.append(div)

    if (item !== 0 && (itemAdditional === items[4].id || itemAdditional === items[5].id)) {
        if (itemAdditional === items[4].id) {
            frontCreateHealth(div, '3px')
        }
        if (itemAdditional === items[5].id) {
            frontCreateHealth(div, '3px')
        }
    }
}

function frontCreateHealth(div, height_px) {
    var divHelth = document.createElement('div')
    divHelth.classList.add('health')
    divHelth.style.height = height_px
    div.appendChild(divHelth)
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowLeft' || event.code == 'ArrowRight' || event.code == 'ArrowUp' || event.code == 'ArrowDown' || event.code == 'Space') {
        if(!gameOver) {updateBoard(event.code)} else {}
    }
  });

//Обновляем игровок поле
function updateBoard(event) {
    if (event === 'ArrowLeft') {
        updateMap(0, -1)
    }
    if (event === 'ArrowRight') {
        updateMap(0, 1)
    }
    if (event === 'ArrowUp') {
        updateMap(-1, 0)
    }
    if (event === 'ArrowDown') {
        updateMap(1, 0)
    }
    if (event === 'Space') {
        updateMap(0, 0)
    }
    function updateMap (changeI, changeJ) {
        console.log(map);
        //backCalculateNearPersonAndEnemy ()
       
        backMoveAction(map, changeI, changeJ, 'tileP')
        backMoveAction(map, changeI, changeJ, 'tileE')
        backEnemyAtack(changeI, changeJ)
        
    }
}

function backEnemyAtack (changeI, changeJ) {
    var calculateNearPersonAndEnemy = [0, 0, 0]
    calculateNearPersonAndEnemy = backCalculateNearPersonAndEnemy()
    var enemyId = calculateNearPersonAndEnemy[0]
    //enemyId = backCalculateNearPersonAndEnemy()
    console.log(calculateNearPersonAndEnemy);
    
    if (changeI === 0 && changeJ === 0 && calculateNearPersonAndEnemy[0] !== 0) {
        var enemyItem = document.querySelector('#id' + enemyId)
        var enemyItemHealth = enemyItem.querySelector('.health')
        var enemyItemHealthHeight = enemyItemHealth.style.height 
        enemyItemHealth.parentNode.removeChild(enemyItemHealth)
        frontCreateHealth(enemyItem, (parseInt(enemyItemHealthHeight.match(/\d+/) - swordsDamage)) + 'px')

        if ((parseInt(enemyItemHealthHeight.match(/\d+/) - swordsDamage)) <= 0) {
            console.log('id:' +calculateNearPersonAndEnemy[0]);
            console.log('i:' +calculateNearPersonAndEnemy[1]);
            console.log('j:' +calculateNearPersonAndEnemy[2]);
            frontRemoveItemClassName (enemyId, 'tileE')
            frontRemoveItemChildForUpdateMap (enemyId, 'health', 1, 1)
            frontChangeScore ('score', score++)
            map[calculateNearPersonAndEnemy[1]][calculateNearPersonAndEnemy[2]] = 1
            console.log(map);
        }
    } else {
        if (counter >= 2) {
            var personItem = document.querySelector('.tileP')
            var personItemHealth = personItem.querySelector('.health')
            var personItemHealthHeight = personItemHealth.style.height 
            personItemHealth.parentNode.removeChild(personItemHealth)
            frontCreateHealth(personItem, (parseInt(personItemHealthHeight.match(/\d+/) - 1)) + 'px')
    
            if ((parseInt(personItemHealthHeight.match(/\d+/) - 1)) === 0) {
                gameOver = true
            }
        }
    }
}

function backCalculateNearPersonAndEnemy () {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            if (map[i][j] == 5) {
                try { if (map[i][j - 1] === 4) {
                    counter++
                    if (map[i][j - 1] === 4) return [backGetElementIdForGenerateMap(map[0].length, i, j - 1), i, j - 1]
                } } catch {}
                try { if (map[i][j + 1] === 4) {
                    counter++
                    if (map[i][j + 1] === 4) return [backGetElementIdForGenerateMap(map[0].length, i, j + 1), i, j + 1]
                } } catch {}
                try { if (map[i - 1][j] === 4) {
                    counter++
                    if (map[i - 1][j] === 4) return [backGetElementIdForGenerateMap(map[0].length, i - 1, j), i - 1, j]
                } } catch {}
                try { if (map[i + 1][j] === 4) {
                    counter++
                    if (map[i + 1][j] === 4) return [backGetElementIdForGenerateMap(map[0].length, i + 1, j), i + 1, j]
                } } catch {}
                counter = 0
                return [0, 0, 0]
            }
        }
    }
}

function getRandomMove () {
    var i = getRandomNumber(-1, 1)
    var j = 0
    if (i === 0) {
        j = getRandomNumber(-1, 1)
    }
    return [i, j]
}

function backMoveAction(array, changeI, changeJ, personOrEnemy) {
    var currentPersonId = findElementIdFromItemClassName(personOrEnemy)
    //console.log(currentPersonId);
    while (currentPersonId.length !== 0) {
        if (personOrEnemy === 'tileE') {
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
                //console.log(`current: ${array[i][j]} new: ${array[i + changeI][j + changeJ]} curcoords: ${coordinates}`);
            
                array[i][j] = array[i + changeI][j + changeJ]
                array[i + changeI][j + changeJ] = currentItem
                //console.log(`current: ${array[i][j]} new: ${array[i + changeI][j + changeJ]} curcoords: ${coordinates}`);
                //console.log(array);

                frontMoveAction(currentPersonId[0], newPersonId, personOrEnemy, pickHP, pickSW)

                currentPersonId.shift()
            }
        } catch { currentPersonId.shift()}
    }
}

function findElementIdFromItemClassName (className) {
    var arrayOfElementId = []
    if (className === 'tileP') {
        arrayOfElementId.push(parseInt(document.querySelector('.' + className).getAttribute('id').match(/\d+/)))
        return arrayOfElementId
    } else {
        document.querySelectorAll('.' + className).forEach((e) => arrayOfElementId.push(parseInt(e.getAttribute('id').match(/\d+/))))
        return arrayOfElementId
    }
}

//findIndexMapFromId(array, 100)
function findIndexMapFromId (array, elementId) {
    var i = Math.floor(elementId / array[0].length)
    var j = elementId - i * array[0].length
    return [i, j]
}

function frontMoveAction (currentId, newId, className, pickHP, pickSW) {
    frontAddItemForUpdateMap (newId, className, pickHP, pickSW, currentId)
    frontRemoveItemChildForUpdateMap (currentId, className, pickHP, pickSW)
}

function frontRemoveItemChildForUpdateMap (currentId, className, pickHP, pickSW) {
    var currentItem = document.querySelector('#id' + currentId)
    currentItem?.classList.remove(className)
    currentItem.removeChild(currentItem.firstChild)
}

function frontAddItemForUpdateMap (newId, className, pickHP, pickSW, currentId) {
    var newItem = document.querySelector('#id' + newId)
    var currentItem = document.querySelector('#id' + currentId)
    var healthItem = currentItem.querySelector('.health')
    var healthHeight = healthItem.style.height

    newItem.classList.add(className)

    if (className === 'tileP') {
        var divHelth = document.createElement('div')
        divHelth.classList.add('health')
        divHelth.style.height = healthHeight
        
        // console.log(counter);
        // if (counter >= 2) {
        //     if ((parseInt(divHelth.style.height.match(/\d+/))) > 0) {
        //         //console.log('я тут');
        //         divHelth.style.height = (parseInt(healthHeight.match(/\d+/)) - 1) + 'px'
        //         console.log((parseInt(healthHeight.match(/\d+/)) + 1) + 'px');
        //     }
        // }

        if (pickHP) {
            if ((parseInt(divHelth.style.height.match(/\d+/))) < 10) {
                divHelth.style.height = (parseInt(healthHeight.match(/\d+/)) + 1) + 'px'
                console.log((parseInt(healthHeight.match(/\d+/)) + 1) + 'px');
            }
            frontRemoveItemClassName(newId, 'tileHP')
        }
        newItem.appendChild(divHelth)
    }

    if (className === 'tileE') {
        var divHelth = document.createElement('div')
        divHelth.classList.add('health')
        divHelth.style.height = healthHeight

        if (pickHP) {
            frontRemoveItemClassName(newId, 'tileHP')
        }
        newItem.appendChild(divHelth)
    }

    if (pickSW) {
        frontRemoveItemClassName(newId, 'tileSW')
        if (className === 'tileP') {
        swordsDamage++
        frontCreateItem('inventory', 'inventoryItems')
        }
    }
} 

function frontRemoveItemClassName (id, className) {
    var item = document.querySelector('#id' + id)
    item?.classList.remove(className)
}

function frontCreateItem (className, addClassName) {
    var item = document.querySelector('.' + className)
    var div = document.createElement('div')
    div.classList.add(addClassName)
    item.append(div)
}

function frontChangeScore (className, score) {
    score++
    var item = document.querySelector('.' + className)
    item.innerHTML = `Score ${score}`
}