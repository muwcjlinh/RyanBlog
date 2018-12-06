import Category from '../models/category';
import DetailCategory from '../models/detailCategory';

//= ==============================
//= Create new category
//= ==============================
export function createCategory (req, res) {
  if (!req.body || !req.body.nameCategory || !req.body.firstColumn || !req.body.secondColumn) {
    return res.status(422).json({ error: 'Lack of input data' });
  } else {
    let category = new Category ({
      owner: req.user._id,
      nameCategory: req.body.nameCategory
    });
    let detailCategory = new DetailCategory ({
      owner: req.user._id,
      categoryId: category._id,
      firstColumn: req.body.firstColumn,
      secondColumn: req.body.secondColumn
    });
    category.save()
      .then(() => {
        return detailCategory.save();
      })
      .then((result) => {
        res.status(200).json({
          category: {
            _id: category._id,
            nameCategory: category.nameCategory,
            details: [result]
          }
        });
      })
      .catch(
        /* istanbul ignore next */
        err => {
          res.status(422).json({ error: err });
        }
      );
  }
}

//= ============================
//= Update category
//= ============================
export function updateCategory(req, res) {
  Category.findOne({ _id: req.params.categoryId, owner: req.user._id })
    .then(category => {
      if (!category) {
        res.status(422).json({ error: 'Can not find this category to update.' });
      } else if (!req.body.nameCategory) {
        res.status(422).json({ error: 'You have to fill name of category.' });
      } else {
        category.nameCategory = req.body.nameCategory;
        category.visible = req.body.visible;
        return category.save();
      }
    })
    .then(result => {
      if (result) {
        res.status(200).json({ info: result });
      }
    })
    .catch(
      /* istanbul ignore next */
      err => {
        res.status(422).json({ error: err });
      }
    );
}

//= ============================
//= Create Detail for category
//= ============================
export function createDetailCategory (req, res) {
  if (!req.body || !req.body.categoryId || !req.body.firstColumn || !req.body.secondColumn) {
    return res.status(422).json({ error: 'Lack of input data' });
  } else {
    let nameCategory;
    Category.findOne({ _id: req.body.categoryId })
      .then(result => {
        if (!result) {
          res.status(422).json({ error: 'Wrong categoryId' });
        } else {
          nameCategory = result.nameCategory;
          let detailCategory = new DetailCategory ({
            owner: req.user._id,
            categoryId: req.body.categoryId,
            firstColumn: req.body.firstColumn,
            secondColumn: req.body.secondColumn
          });
          return detailCategory.save();
        }
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            category: {
              _id: req.body.categoryId,
              nameCategory: nameCategory,
              details: result
            }
          });
        }
      })
      .catch(
        /* istanbul ignore next */
        err => {
          res.status(422).json({ error: err });
        }
      );
  }
}

//= ===========================
//= Update detail category
//= ===========================
export function updateDetailCategory (req, res) {
  DetailCategory.findOne({ _id: req.params.detailId, owner: req.user._id })
    .then(detail => {
      if (!detail) {
        res.status(422).json({ error: 'Can not find this detail to update.' });
      } else if (!req.body.firstColumn || !req.body.secondColumn) {
        res.status(422).json({ error: 'You have to fill your detail.' });
      } else {
        detail.firstColumn = req.body.firstColumn;
        detail.secondColumn = req.body.secondColumn;
        return detail.save();
      }
    })
    .then(result => {
      if (result) {
        res.status(200).json({ info: result });
      }
    })
    .catch(
      /* istanbul ignore next */
      err => {
        res.status(422).json({ error: err });
      }
    );
}

//= ==========================
//= Get all categories
//= ==========================
export function getAllCategories (req, res) {
  Category.find({ owner: req.user._id })
    .then(categories => {
      res.status(200).json({ categories: categories });
    })
    .catch(
      /* istanbul ignore next */
      err => {
        res.status(422).json({ error: err });
      }
    );
}

//= ==========================
//= Get all details of category
//= ==========================
export function getAllDetails (req, res) {
  DetailCategory.find({ categoryId: req.params.categoryId, owner: req.user._id })
    .then(details => {
      if (details.length == 0) {
        res.status(422).json({ error: 'Can not view details of this category' });
      } else {
        res.status(200).json({ categoryId: req.params.categoryId, details: details });
      }
    })
    .catch(
      /* istanbul ignore next */
      err => {
        res.status(422).json({ error: err });
      }
    );
}
