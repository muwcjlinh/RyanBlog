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
    saveCategory(category)
      .then(() => {
        return saveDetailCategory(category._id, req.body.firstColumn, req.body.secondColumn);
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
//= Create Detail for category
//= ============================
export function createDetailCategory (req, res) {
  let nameCategory;
  if (!req.body || !req.body.categoryId || !req.body.firstColumn || !req.body.secondColumn) {
    return res.status(422).json({ error: 'Lack of input data' });
  } else {
    Category.findOne({ _id: req.body.categoryId })
      .then(result => {
        if (!result) {
          res.status(422).json({ error: 'Wrong categoryId' });
        }
        nameCategory = result.nameCategory;
        return saveDetailCategory(req.body.categoryId, req.body.firstColumn, req.body.secondColumn);
      })
      .then((result) => {
        res.status(200).json({
          category: {
            _id: req.body.categoryId,
            nameCategory: nameCategory,
            details: result
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

//= Helper functions
function saveCategory (category) {
  return new Promise ((resolve, reject) => {
    category.save()
      .then(result => {
        resolve(result);
      })
      .catch(
        /* istanbul ignore next */
        err => {
          reject(err);
        }
      );
  });
}

function saveDetailCategory (categoryId, firstColumn, secondColumn) {
  return new Promise ((resolve, reject) => {
    let detailCategory = new DetailCategory ({
      categoryId: categoryId,
      firstColumn: firstColumn,
      secondColumn: secondColumn
    });
    detailCategory.save()
      .then(result => {
        resolve(result);
      })
      .catch(
        /* istanbul ignore next */
        err => {
          reject(err);
        }
      );
  });
}
