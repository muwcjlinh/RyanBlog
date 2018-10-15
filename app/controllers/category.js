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
        return createDetailCategory(category._id, req.body.firstColumn, req.body.secondColumn);
      })
      .then((result) => {
        res.status(200).json({
          category: {
            nameCategory: category.nameCategory,
            details: [result]
          }
        });
      })
      .catch(err => {
        res.status(422).json({ error: err });
      });
  }
}

//= Helper functions
function saveCategory (category) {
  return new Promise ((resolve, reject) => {
    category.save()
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function createDetailCategory (categoryId, firstColumn, secondColumn) {
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
      .catch(err => {
        reject(err);
      });
  });
}
