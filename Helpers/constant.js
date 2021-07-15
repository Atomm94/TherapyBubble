let error = {};

const therapistServices = Object.freeze({
    MASSAGE: 'massage',
    DENTIST: 'dentist',
    PLASTIC_SURGEON: 'plastic surgeon'
})

const sessionFormat = Object.freeze({
    ONLINE: 'online',
    OFFLINE: 'offline'
})

const Steps = Object.freeze({
    ONE: 'one',
    TWO: 'two',
    FINISH: 'finish'
});

const categories = Object.freeze({
    cosmetic: false,
    fitness: true,
    yoga: false,
    pharmacy: true
})

const productsType = Object.freeze({
    GIFT_CARD: 'gift card',
    PRODUCT: 'product',
    PACKAGE: 'package'
})

export {
    error,
    therapistServices,
    sessionFormat,
    Steps,
    categories,
    productsType
}
