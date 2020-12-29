import Post from '../models/Post';
import errorHandler from '../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';

const listNewsFeed = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    const posts = await Post.find({ postedBy: { $in: req.profile.following } })
                        .populate('comments.postedBy', '_id name')
                        .populate('postedBy', '_id name')
                        .sort('-created')
                        .exec()
    res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByUser = async (req, res) => {
  try {
    console.log('El perfil ===>', req.profile);
    const posts = await Post.find({ postedBy: req.profile._id })
                            .populate('comments.postedBy', '_id name')
                            .populate('postedBy', '_id name')
                            .sort('-created')
                            .exec();
    res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const create = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: 'La imagen no puede ser subida'
      })
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if(files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    try {
      const result = await post.save();
      res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      })
    }
  })
}

const photo = (req, res) => {
  res.set('Content-Type', req.post.photo.contentType);
  return res.send(req.post.photo.data)
}

const postById = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
                           .populate('postedBy', '_id name')
                           .exec();
    if(!post) {
      return res.status(400).json({
        error: 'Post no encontrado'
      })
    }
    req.post = post;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'No pudimos recuperar el post'
    })
  }
}

const isPoster = (req, res, next) => {
  const isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if(!isPoster) {
    return res.status(403).json({
      error: 'El usuario no está autorizado'
    })
  }
  next();
}

const remove = async (req, res) => {
  const post = req.post
  try {
    const deletedPost = await post.remove();
    res.json(deletedPost);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const like = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(req.body.postId,
                                                { $push: {likes: req.body.userId } },
                                                {new: true}
                                                )
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const unlike = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
  } catch (error) {
    return res.sttus(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId
  try {
    const result = await Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, { new: true})
                             .populate('comments.postedBy', '_id name')
                             .populate('postedBy', '_id name')
                             .exec();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const uncomment = async (req, res) => {
  const comment = req.body.comment
  try {
    const result = await Post.findByIdAndUpdate(req.body.postId,
      { $pull: {comments: {_id: comment._id}}},
      {new: true }
    ).poputlate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

export default { 
  listNewsFeed, 
  listByUser, 
  create, 
  photo, 
  postById, 
  isPoster, 
  remove,
  like,
  unlike,
  comment,
  uncomment
}