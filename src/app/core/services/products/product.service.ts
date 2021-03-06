import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { MessageType } from "../../models/message.type";
import * as fromCoreActions from "../../store/core.actions";
import { CoreState } from "../../store/core.reducer";
import { HttpClient } from "@angular/common/http";
import { UpdateProductsListRequest } from "../../../core/models/update.list.product";
import { catchError } from "rxjs/operators";
import { ProductResponse } from "../../../core/models/product.response";
import { ProductOrderingProposalResponse } from "../../models/product.proposal.response";
import {
  BaseModel,
  ProductDetailResponse,
  ProductInventoryRequest,
} from "../../models";
import { ProductInventoriesResponse } from "../../models/products.inventories.response";
import { ProductsAboutToExpireResponse } from "../../models/products.about.to.expire.response";
@Injectable({
  providedIn: "root",
})
export class ProductService {
  baseUrl = "/rs/products";
  constructor(private http: HttpClient, private store: Store<CoreState>) {}

  updateProducts(
    request: UpdateProductsListRequest
  ): Observable<ProductResponse> {
    return this.http
      .post<ProductResponse>(this.baseUrl + "/update-list", request)
      .pipe(catchError(this.handleError<ProductResponse>()));
  }

  loadProductsForProposal(): Observable<ProductOrderingProposalResponse> {
    return this.http
      .get<ProductOrderingProposalResponse>(this.baseUrl + "/proposals")
      .pipe(catchError(this.handleError<ProductOrderingProposalResponse>()));
  }

  loadInventories(
    request: ProductInventoryRequest
  ): Observable<ProductInventoriesResponse> {
    return this.http
      .post<ProductInventoriesResponse>(
        this.baseUrl + "/products-inventories",
        { request }
      )
      .pipe(catchError(this.handleError<ProductInventoriesResponse>()));
  }

  private handleError<BaseModel>(result?: BaseModel) {
    return (error: any): Observable<BaseModel> => {
      console.log(error); // log to console instead
      this.store.dispatch(
        fromCoreActions.onNotificationMessage({
          msgType: MessageType.ERROR,
          msg: error.message,
        })
      );
      return of(result);
    };
  }

  updateProductsForProposal(request): Observable<BaseModel> {
    return this.http
      .post<BaseModel>(this.baseUrl + "/update-for-proposal", { ...request })
      .pipe(catchError(this.handleError<BaseModel>()));
  }

  loadProductDetail(productId: number): Observable<ProductDetailResponse> {
    return this.http
      .get<ProductDetailResponse>(
        this.baseUrl.concat("/").concat(productId.toString()).concat("/detail")
      )
      .pipe();
  }

  loadProductsBetweenRange(
    startDate,
    endDate
  ): Observable<ProductDetailResponse> {
    return this.http
      .post<ProductDetailResponse>(this.baseUrl + "/between-range", {
        startDate: startDate,
        endDate: endDate,
      })
      .pipe(catchError(this.handleError<ProductDetailResponse>()));
  }

  loadProductsThatAreAboutToExpire(
    numberOfMonthAfter: string
  ): Observable<ProductsAboutToExpireResponse> {
    return this.http
      .get<ProductsAboutToExpireResponse>(
        this.baseUrl
          .concat("/")
          .concat("products-about-to-expire?expireOn=")
          .concat(numberOfMonthAfter)
      )
      .pipe(catchError(this.handleError<any>()));
  }
}
